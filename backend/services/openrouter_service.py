import os
import json
import re
import requests
from typing import List, Dict, Any, Optional
try:
    from backend.config.config import get_openrouter_api_key, OPENROUTER_FREE_MODELS
except ImportError:
    from config.config import get_openrouter_api_key, OPENROUTER_FREE_MODELS

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


class OpenRouterClient:
    """
    Cliente para integração com a API do OpenRouter utilizando EXCLUSIVAMENTE
    modelos GRATUITOS (:free tier), com sistema de fallback automático em cascata.
    """

    def __init__(self, api_key: Optional[str] = None, custom_models: Optional[List[str]] = None):
        self._custom_key = api_key
        self._custom_models = custom_models

    @property
    def api_key(self) -> str:
        return self._custom_key or get_openrouter_api_key()

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/tcc-smartinvest-ai",
            "X-Title": "TCC-SmartInvest-AI-Orchestrator",
        }

    @property
    def free_models(self) -> List[str]:
        if self._custom_models:
            return self._custom_models
        try:
            from backend.config.config import OPENROUTER_FREE_MODELS
            return OPENROUTER_FREE_MODELS
        except ImportError:
            try:
                from config.config import OPENROUTER_FREE_MODELS
                return OPENROUTER_FREE_MODELS
            except Exception:
                return ["openrouter/free", "inclusionai/ling-3.0-flash-fin:free"]

    def chamar_llm_gratuita(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.4,
        max_tokens: int = 1500
    ) -> Dict[str, Any]:
        """
        Executa chamada aos modelos gratuitos do OpenRouter com fallback automático.
        """
        current_key = self.api_key
        if not current_key or not current_key.strip():
            return {
                "sucesso": False,
                "modelo_utilizado": "nenhum",
                "resposta": self._gerar_resposta_fallback_sem_chave(messages),
                "aviso": "Chave OPENROUTER_API_KEY não configurada. Resposta gerada via motor heurístico local."
            }

        erros = []
        for model_name in self.free_models:
            payload = {
                "model": model_name,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }

            try:
                response = requests.post(
                    OPENROUTER_URL,
                    headers=self._headers(),
                    json=payload,
                    timeout=9
                )

                if response.status_code == 200:
                    data = response.json()
                    choice = data.get("choices", [{}])[0]
                    msg_obj = choice.get("message", {})
                    conteudo = msg_obj.get("content")

                    # Se o conteúdo estiver vazio mas houver reasoning, usa o reasoning
                    if not conteudo and msg_obj.get("reasoning"):
                        conteudo = msg_obj.get("reasoning")

                    if conteudo and str(conteudo).strip():
                        # Limpar tags de pensamento tipo <think>...</think> se presentes
                        conteudo_limpo = re.sub(r"<think>.*?</think>", "", str(conteudo), flags=re.DOTALL).strip()
                        return {
                            "sucesso": True,
                            "modelo_utilizado": model_name,
                            "resposta": conteudo_limpo or str(conteudo),
                            "dados_brutos": data
                        }

                erros.append(f"Modelo {model_name} status {response.status_code}: {response.text[:120]}")

            except Exception as exc:
                erros.append(f"Falha ao chamar {model_name}: {str(exc)}")
                continue

        # Se todos os modelos gratuitos falharem (por instabilidade do OpenRouter ou rate limit)
        return {
            "sucesso": False,
            "modelo_utilizado": "fallback_local",
            "resposta": self._gerar_resposta_fallback_sem_chave(messages),
            "erros_openrouter": erros,
            "aviso": "Modelos gratuitos do OpenRouter temporariamente ocupados. Resposta gerada via motor de contingência."
        }

    def orquestrar_analise_ativo(
        self,
        ticker: str,
        dados_quantitativos: Dict[str, Any],
        noticias: List[Dict[str, Any]],
        sentimento_nlp: float
    ) -> Dict[str, Any]:
        """
        Orquestra a síntese preditiva unindo:
        1. Modelo Quantitativo de ML (XGBoost / Preço / Indicadores / Selic)
        2. Modelo de NLP (FinBERT / Notícias recentes)
        """
        noticias_formatadas = "\n".join([
            f"- [{n.get('data', 'Recente')}] {n.get('titulo', '')} (Fonte: {n.get('fonte', 'Mercado')})"
            for n in noticias[:5]
        ]) or "Nenhuma notícia relevante recente registrada no período."

        prompt_sistema = (
            "Você é o SmartInvest AI Orchestrator, um analista quantitativo sênior de renda variável "
            "e finanças comportamentais focado no mercado brasileiro (B3). "
            "Sua função é sintetizar dados de modelos de Machine Learning (XGBoost) com "
            "análises de sentimento de notícias (FinBERT) para produzir um parecer institucional robusto, "
            "didático e fundamentado."
        )

        prompt_usuario = f"""
Por favor, elabore um parecer executivo para o ativo **{ticker.upper()}** cruzando as camadas quantitativa e qualitativa:

### 1. DADOS QUANTITATIVOS & MACHINE LEARNING (XGBOOST):
- Preço Atual: R$ {dados_quantitativos.get('preco_atual', 'N/D')}
- Probabilidade de Superar a Selic (XGBoost): {dados_quantitativos.get('prob_ml', 0) * 100:.2f}%
- Sinal Quantitativo: {dados_quantitativos.get('decisao_sugerida', 'NEUTRO')}
- Score Composto (0 a 100): {dados_quantitativos.get('score_final', 50):.1f}
- Média Móvel 21 dias (distância): {dados_quantitativos.get('ma_21_dist', 0) * 100:+.2f}%
- Média Móvel 50 dias (distância): {dados_quantitativos.get('ma_50_dist', 0) * 100:+.2f}%
- Média Móvel 200 dias (distância): {dados_quantitativos.get('ma_200_dist', 0) * 100:+.2f}%
- RSI (14 dias): {dados_quantitativos.get('rsi', 50):.1f}
- Volatilidade Anualizada (30d): {dados_quantitativos.get('vol_30', 0) * 100:.2f}%
- Momentum (63d): {dados_quantitativos.get('momentum_63', 0) * 100:+.2f}%
- Taxa Selic Vigente: {dados_quantitativos.get('selic_anual', 10.5):.2f}% a.a.

### 2. DADOS DE SENTIMENTO & NLP (FinBERT):
- Índice de Humor Líquido do Ativo (-1.0 a +1.0): {sentimento_nlp:+.3f}
- Principais Manchetes Coletadas:
{noticias_formatadas}

### ESTRUTURA DO SEU PARECER:
1. **Resumo Executivo (Sinal Final: Compra / Aguardar / Evitar)**
2. **Análise dos Indicadores Técnicos & Padrão de Tendência**
3. **Impacto do Sentimento de Mercado & Notícias**
4. **Cenário Macro (Taxa Selic vs Retorno Esperado)**
5. **Principais Riscos e Pontos de Atenção**
"""

        messages = [
            {"role": "system", "content": prompt_sistema},
            {"role": "user", "content": prompt_usuario}
        ]

        resultado = self.chamar_llm_gratuita(messages, temperature=0.3, max_tokens=1500)
        return {
            "ticker": ticker.upper(),
            "sintese_ia": resultado["resposta"],
            "modelo_utilizado": resultado.get("modelo_utilizado"),
            "status_ia": resultado.get("sucesso", False),
            "aviso": resultado.get("aviso", "")
        }

    def responder_chat_financeiro(
        self,
        mensagem_usuario: str,
        historico_mensagens: Optional[List[Dict[str, str]]] = None,
        contexto_mercado: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Responde a dúvidas do usuário no chat (tanto sobre ativos específicos quanto finanças gerais).
        """
        # Se o usuário mencionou um ticker no texto (ex: BBSE3, PETR4, VALE3, etc.)
        ticker_detectado = self._detectar_ticker(mensagem_usuario)
        if ticker_detectado and not contexto_mercado:
            try:
                try:
                    from backend.services.market_service import market_service
                except ImportError:
                    from services.market_service import market_service
                contexto_mercado = market_service.obter_dados_ativo(ticker_detectado)
            except Exception:
                pass

        prompt_sistema = (
            "Você é o SmartInvest AI, o assistente inteligente oficial da plataforma de investimentos Aporta. "
            "Você é especialista em análise de ações da B3, fundos imobiliários (FIIs), renda fixa, taxa Selic, "
            "e modelos quantitativos de Machine Learning e Teoria de Markowitz. "
            "Responda sempre em português do Brasil de forma clara, didática, profissional e bem formatada em Markdown. "
            "Quando perguntado sobre um ativo específico (ex: BBSE3, PETR4, VALE3), apresente: "
            "1. Visão geral e tese do ativo (dividendos, crescimento, setor). "
            "2. Cenário macro (como a Selic e o momento atual impactam o papel). "
            "3. Veredito analítico (pontos fortes, riscos e momento de entrada/manutenção)."
        )

        messages = [{"role": "system", "content": prompt_sistema}]

        if contexto_mercado:
            contexto_str = (
                f"DADOS QUANTITATIVOS DO ATIVO ({contexto_mercado.get('ticker')}):\n"
                f"- Preço: R$ {contexto_mercado.get('preco_atual')}\n"
                f"- Sinal Machine Learning: {contexto_mercado.get('decisao_sugerida')}\n"
                f"- Probabilidade de Alta: {contexto_mercado.get('prob_ml', 0)*100:.1f}%\n"
                f"- Score Composto: {contexto_mercado.get('score_final')}/100\n"
                f"- RSI (14): {contexto_mercado.get('rsi')}\n"
                f"- Selic: {contexto_mercado.get('selic_anual')}% a.a.\n"
            )
            messages.append({"role": "system", "content": contexto_str})

        if historico_mensagens:
            for msg in historico_mensagens[-6:]:
                if msg.get("role") in ["user", "assistant", "system"] and msg.get("content"):
                    messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": mensagem_usuario})

        resultado = self.chamar_llm_gratuita(messages, temperature=0.5, max_tokens=1200)
        return {
            "resposta": resultado["resposta"],
            "modelo_utilizado": resultado.get("modelo_utilizado"),
            "sucesso": resultado.get("sucesso", False),
            "aviso": resultado.get("aviso", "")
        }

    def _detectar_ticker(self, texto: str) -> Optional[str]:
        """Detecta se há um ticker da B3 na mensagem (ex: BBSE3, PETR4, MXRF11)."""
        match = re.search(r"\b([A-Z]{4}(?:3|4|5|6|11))\b", texto.upper())
        if match:
            return match.group(1)
        return None

    def _gerar_resposta_fallback_sem_chave(self, messages: List[Dict[str, str]]) -> str:
        """Gera resposta heurística contextual quando o OpenRouter não estiver disponível."""
        last_user_msg = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user_msg = m.get("content", "")
                break

        ticker = self._detectar_ticker(last_user_msg)
        texto_baixo = last_user_msg.lower()

        if ticker:
            try:
                try:
                    from backend.services.market_service import market_service
                except ImportError:
                    from services.market_service import market_service
                dados = market_service.obter_dados_ativo(ticker)
                if dados:
                    return (
                        f"### 📊 Análise Quantitativa do Ativo **{ticker}** (Modo Local)\n\n"
                        f"- **Preço Atual:** R$ {dados.get('preco_atual', 'N/D')}\n"
                        f"- **Sinal Sugerido:** {dados.get('decisao_sugerida', 'NEUTRO')}\n"
                        f"- **Score Composto:** {dados.get('score_final', 50)}/100\n"
                        f"- **RSI (14 dias):** {dados.get('rsi', 50):.1f}\n"
                        f"- **Taxa Selic Referência:** {dados.get('selic_anual', 10.5)}% a.a.\n\n"
                        f"> *Nota: Análise gerada pelo motor quantitativo local da plataforma Aporta.*"
                    )
            except Exception:
                pass

        if "selic" in texto_baixo or "taxa" in texto_baixo:
            return (
                "### 🏛️ Impacto da Taxa Selic nos Investimentos\n\n"
                "A **Taxa Selic** é a taxa básica de juros da economia brasileira:\n"
                "- **Renda Fixa:** Selic mais alta remunera melhor títulos pós-fixados (Tesouro Selic, CDBs).\n"
                "- **Renda Variável & FIIs:** Taxas elevadas elevam o custo de oportunidade, pressionando ações e fundos de tijolo.\n"
                "- **Estratégia:** Manter reserva de oportunidade atrelada ao CDI e balancear aportes regulares em empresas com bons dividendos."
            )

        if "sharpe" in texto_baixo:
            return (
                "### 💡 Índice de Sharpe\n\n"
                "O **Índice de Sharpe** mede a relação entre o retorno excedente de um ativo e o risco incorrido (volatilidade):\n"
                "- Fórmula: `(Retorno da Carteira - Taxa Livre de Risco) / Volatilidade`\n"
                "- Quanto maior o Sharpe, mais eficiente é a relação retorno/risco do investimento."
            )

        if "markowitz" in texto_baixo or "carteira" in texto_baixo:
            return (
                "### 🎯 Teoria Moderna do Portfólio (Markowitz)\n\n"
                "Harry Markowitz demonstrou que a diversificação ótima reduz o risco não-sistêmico sem sacrificar o retorno esperado:\n"
                "- O modelo combina ativos com baixa correlação para encontrar a **Fronteira Eficiente**.\n"
                "- Utilize a aba **Smart Invest** no menu para calcular sua alocação personalizada!"
            )

        return (
            "Olá! Sou o **SmartInvest AI Assistant** da plataforma Aporta.\n\n"
            "Posso te ajudar com:\n"
            "- Análise de ações da B3 (ex: PETR4, VALE3, BBSE3, ITUB4)\n"
            "- Indicadores quantitativos e sinal de Machine Learning\n"
            "- Conceitos de Sharpe, Markowitz, Selic e diversificação de patrimônio.\n\n"
            "Qual ativo ou dúvida você gostaria de explorar agora?"
        )


# Instância global compartilhada
openrouter_service = OpenRouterClient()
