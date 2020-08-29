import get from 'lodash.get';
export const getIframeAuthValue = (state, value) => {
  const useProfitCenterByConcept = get(state.sites.orderConfig, 'profitCenter.useProfitCenterByConcept', false);
  const iFrameAuthValue = (useProfitCenterByConcept && get(state.cart.conceptOptions, 'profitCenterId') && get(state.cart.conceptOptions, value)) || get(state.sites.orderConfig, `pay.${value}`); // eslint-disable-line max-len
  return iFrameAuthValue;
};

export const sortByExpiry = (loyalties) => {
  let unsorted = loyalties.slice();
  return unsorted.sort((a, b) => {
    let expTimeA, expTimeB;
    if (!a.expirationDate) { expTimeA = null; } else { expTimeA = new Date(a.expirationDate); }
    if (!b.expirationDate) { expTimeB = null; } else { expTimeB = new Date(b.expirationDate); }

    if ((!expTimeA === null) && (expTimeB === null)) return 0;
    else if ((expTimeA === null) && (expTimeB != null)) return 1;
    else if ((expTimeA != null) && (expTimeB === null)) return -1;
    // eslint-disable-next-line eqeqeq
    else if ((expTimeA == expTimeB)) return 0;
    else return (expTimeA > expTimeB) ? 1 : ((expTimeB > expTimeA) ? -1 : 0);
  });
};

export const getHighValueVoucher = (vouchers, amountToCharge) => {
  let result;
  vouchers.forEach(voucher => {
    if (parseFloat(voucher.currencyAmount) < parseFloat(amountToCharge)) {
      return;
    }
    if (!result || parseFloat(voucher.currencyAmount) < parseFloat(result.currencyAmount)) {
      result = voucher;
    }
    if (parseFloat(voucher.currencyAmount) === parseFloat(result.currencyAmount)) {
      result = sortByExpiry([voucher, result])[0];
    }
  });
  return result;
};
