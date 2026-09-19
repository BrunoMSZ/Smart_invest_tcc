import json
from datetime import datetime, timedelta
from .connection import SessionLocal
from .models import User, Post, Grupo, CarteiraItem, Questionario
from .auth_utils import hash_password


def seed_database():
    """Popula o banco de dados com dados iniciais realistas se a tabela de usuários estiver vazia."""
    db = SessionLocal()
    try:
        # Se já existirem usuários cadastrados, não sobrescreve
        if db.query(User).first() is not None:
            return

        print("[Seed] Populando banco de dados inicial...")

        # 1. Usuários
        user_rafael = User(
            nome="Rafael Duarte",
            email="rafael@aporta.com",
            senha_hash=hash_password("senha123"),
            handle="@rafaduarte",
            initials="RD",
            perfil_investidor="moderado",
            renda_mensal=6500.0,
            idade=32,
            patrimonio_estimado=78500.0,
            pontos=34,
            nivel=6,
            nivel_nome="Investidor Consistente",
            sequencia_meses=8,
            proximo_nivel_pontos=40,
            badge="Ouro",
            data_cadastro=datetime.utcnow() - timedelta(days=240)
        )

        user_marina = User(
            nome="Marina Costa",
            email="marina@aporta.com",
            senha_hash=hash_password("senha123"),
            handle="@marinac",
            initials="MC",
            perfil_investidor="arrojado",
            renda_mensal=12000.0,
            idade=29,
            patrimonio_estimado=142000.0,
            pontos=58,
            nivel=9,
            nivel_nome="Diamante",
            sequencia_meses=22,
            proximo_nivel_pontos=70,
            badge="Diamante",
            data_cadastro=datetime.utcnow() - timedelta(days=660)
        )

        user_caio = User(
            nome="Caio Menezes",
            email="caio@aporta.com",
            senha_hash=hash_password("senha123"),
            handle="@caiom",
            initials="CM",
            perfil_investidor="arrojado",
            renda_mensal=9500.0,
            idade=27,
            patrimonio_estimado=95000.0,
            pontos=51,
            nivel=8,
            nivel_nome="Diamante",
            sequencia_meses=19,
            proximo_nivel_pontos=60,
            badge="Diamante",
            data_cadastro=datetime.utcnow() - timedelta(days=570)
        )

        user_bruno = User(
            nome="Bruno Alves",
            email="bruno@aporta.com",
            senha_hash=hash_password("senha123"),
            handle="@brunoalves",
            initials="BA",
            perfil_investidor="conservador",
            renda_mensal=8000.0,
            idade=35,
            patrimonio_estimado=110000.0,
            pontos=29,
            nivel=5,
            nivel_nome="Ouro",
            sequencia_meses=6,
            proximo_nivel_pontos=35,
            badge="Ouro",
            data_cadastro=datetime.utcnow() - timedelta(days=180)
        )

        db.add_all([user_rafael, user_marina, user_caio, user_bruno])
        db.commit()

        # Recarregar IDs
        db.refresh(user_rafael)
        db.refresh(user_marina)
        db.refresh(user_caio)
        db.refresh(user_bruno)

        # 2. Posts Iniciais da Comunidade
        p1 = Post(
            user_id=user_marina.id,
            autor_nome=user_marina.nome,
            autor_handle=user_marina.handle,
            autor_initials=user_marina.initials,
            autor_badge="Nível 9 · Diamante",
            conteudo="Aporte de agosto feito. 60% em Tesouro IPCA+ 2035 e 40% dividido entre ITSA4 e HGLG11. Consistência > timing.",
            tag="Aporte",
            comprovante=True,
            likes=132,
            comentarios_count=24,
            data_criacao=datetime.utcnow() - timedelta(minutes=15)
        )

        p2 = Post(
            user_id=user_bruno.id,
            autor_nome=user_bruno.nome,
            autor_handle=user_bruno.handle,
            autor_initials=user_bruno.initials,
            autor_badge="Nível 5 · Ouro",
            conteudo="Alguém acompanhando o balanço do PETR4? A margem operacional veio acima do consenso e o mercado nem reagiu direito.",
            tag="Análise",
            comprovante=False,
            likes=58,
            comentarios_count=41,
            data_criacao=datetime.utcnow() - timedelta(hours=1)
        )

        p3 = Post(
            user_id=user_rafael.id,
            autor_nome="Liga Renda Passiva",
            autor_handle="@ligarendapassiva",
            autor_initials="LP",
            autor_badge="Grupo",
            conteudo="Ranking da liga atualizado! 14 dos 18 membros bateram o aporte mensal. Faltam 4 dias pra fechar o mês, bora.",
            tag="Liga",
            comprovante=False,
            likes=201,
            comentarios_count=12,
            data_criacao=datetime.utcnow() - timedelta(hours=3)
        )

        db.add_all([p1, p2, p3])

        # 3. Grupos / Ligas
        g1 = Grupo(
            nome="Liga Renda Passiva",
            descricao="Foco em dividendos mensais, FIIs de tijolo e ações pagadoras.",
            meta_mensal=800.0,
            privado=True,
            codigo_convite="liga-renda-passiva-8FQ2",
            membros_count=18,
            aportes_mes=14,
            posicao_usuario=4,
            criado_por=user_marina.id
        )

        g2 = Grupo(
            nome="Small Caps BR",
            descricao="Teses assimétricas e empresas em fase de expansão na B3.",
            meta_mensal=500.0,
            privado=True,
            codigo_convite="small-caps-br-44AA",
            membros_count=9,
            aportes_mes=7,
            posicao_usuario=2,
            criado_por=user_caio.id
        )

        g3 = Grupo(
            nome="FIIs de Tijolo",
            descricao="Imóveis corporativos, galpões logísticos e renda imobiliária consistente.",
            meta_mensal=600.0,
            privado=True,
            codigo_convite="fiis-tijolo-77XX",
            membros_count=24,
            aportes_mes=21,
            posicao_usuario=11,
            criado_por=user_rafael.id
        )

        db.add_all([g1, g2, g3])

        # 4. Carteira Recomendada / Ativos do Rafael
        c1 = CarteiraItem(
            user_id=user_rafael.id,
            ticker="Tesouro Selic",
            nome="Tesouro Direto Pós-Fixado",
            classe="Renda Fixa",
            percentual=45.0,
            preco_medio=14200.0,
            quantidade=2.5,
            valor_alocado=35500.0
        )
        c2 = CarteiraItem(
            user_id=user_rafael.id,
            ticker="PETR4",
            nome="Petrobras PN",
            classe="Ação",
            percentual=15.0,
            preco_medio=36.50,
            quantidade=320,
            valor_alocado=11680.0
        )
        c3 = CarteiraItem(
            user_id=user_rafael.id,
            ticker="ITUB4",
            nome="Itaú Unibanco PN",
            classe="Ação",
            percentual=10.0,
            preco_medio=32.80,
            quantidade=240,
            valor_alocado=7872.0
        )
        c4 = CarteiraItem(
            user_id=user_rafael.id,
            ticker="HGLG11",
            nome="CSHG Logística FII",
            classe="FII",
            percentual=18.0,
            preco_medio=161.20,
            quantidade=88,
            valor_alocado=14185.60
        )
        c5 = CarteiraItem(
            user_id=user_rafael.id,
            ticker="IVVB11",
            nome="iShares S&P 500 ETF",
            classe="ETF",
            percentual=12.0,
            preco_medio=285.00,
            quantidade=33,
            valor_alocado=9405.0
        )

        db.add_all([c1, c2, c3, c4, c5])

        # 5. Questionário Inicial
        q1 = Questionario(
            user_id=user_rafael.id,
            idade=32,
            renda_mensal=6500.0,
            respostas_risco=6,
            perfil_resultado="moderado",
            volatilidade_maxima=0.15,
            alocacao_json=json.dumps([
                {"name": "Renda Fixa (CDI / Tesouro)", "value": 45, "classe": "Renda Fixa"},
                {"name": "Ações Nacionais (B3)", "value": 25, "classe": "Ação"},
                {"name": "Fundos Imobiliários (FIIs)", "value": 18, "classe": "FII"},
                {"name": "ETFs Globais / S&P 500", "value": 12, "classe": "ETF"}
            ])
        )
        db.add(q1)

        db.commit()
        print("[Seed] Banco de dados inicializado e populado com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Erro ao popular banco: {e}")
    finally:
        db.close()
