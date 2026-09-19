import numpy as np


def sharpe_ratio(retornos, risk_free=0.13):

    excesso = retornos - risk_free / 252

    sharpe = (
        np.mean(excesso) /
        np.std(excesso)
    ) * np.sqrt(252)

    return sharpe