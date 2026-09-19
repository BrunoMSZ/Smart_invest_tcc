import os
import pandas as pd
import pyarrow.parquet as pq

def restaurar_dataset_original():
    # Identificar caminhos
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
    
    # Se o script for corrido dentro de d_functions, ajusta o caminho para subir um nível
    if not os.path.exists(RAW_DIR):
        RAW_DIR = os.path.join(os.path.dirname(BASE_DIR), "data", "raw")
        
    print(f"[*] Diretório de dados identificado: {RAW_DIR}")
    
    # 1. Listar e ler todos os arquivos anuais de 2010 a 2024
    dfs_anuais = []
    for ano in range(2010, 2025):
        arquivo_ano = os.path.join(RAW_DIR, f"b3_{ano}.parquet")
        if os.path.exists(arquivo_ano):
            print(f"[*] Lendo bloco anual: b3_{ano}.parquet ...")
            df_ano = pq.read_table(arquivo_ano).to_pandas()
            dfs_anuais.append(df_ano)
        else:
            print(f"[!] Alerta: Arquivo b3_{ano}.parquet não encontrado.")
            
    if not dfs_anuais:
        print("[-] Erro Crítico: Nenhum arquivo anual foi encontrado na pasta!")
        return
        
    # Concatenar todos os anos
    print("[*] Consolidando histórico de 2010 a 2024...")
    df_consolidado = pd.concat(dfs_anuais, ignore_index=True)
    df_consolidado["data"] = pd.to_datetime(df_consolidado["data"])
    
    # 2. Re-integrar a Selic original de forma limpa se ela não estiver na base ou para garantir consistência
    selic_path = os.path.join(RAW_DIR, "selic.parquet")
    if os.path.exists(selic_path):
        print("[*] Integrando tabela original da Selic...")
        df_selic = pq.read_table(selic_path).to_pandas()
        df_selic["data"] = pd.to_datetime(df_selic["data"])
        
        # Se a coluna 'selic' já existir na base, removemos para evitar duplicados no merge
        if "selic" in df_consolidado.columns:
            df_consolidado = df_consolidado.drop(columns=["selic"])
            
        colunas_selic = [col for col in df_selic.columns if col != "data"]
        df_consolidado = pd.merge(df_consolidado, df_selic[["data", colunas_selic[0]]], on="data", how="left")
        df_consolidado = df_consolidado.rename(columns={colunas_selic[0]: "selic"})
    
    # Ordenar por ativo e data
    df_consolidado = df_consolidado.sort_values(["ticker", "data"]).reset_index(drop=True)
    
    # 3. Salvar por cima do arquivo corrompido
    final_path = os.path.join(RAW_DIR, "dataset_final.parquet")
    
    print(f"[*] A reescrever o arquivo final: {final_path} ...")
    df_consolidado.to_parquet(final_path, index=False)
    
    print(f"\n[+] 🎉 SUCESSO COMPLETO!")
    print(f"[+] O arquivo 'dataset_final.parquet' foi restaurado com sucesso.")
    print(f"[+] Dimensões da base limpa: {df_consolidado.shape}")
    print("[+] Agora você já pode rodar o ML1.py com o atualizador híbrido de Ações e FIIs!")

if __name__ == "__main__":
    restaurar_dataset_original()