import initialState from "./initialState";
import { produce } from "immer";

const rootReducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch(action.type) {
            case 'setGlobalStatsCryptos': {
                const { globalStats, cryptos } = action.payload;
                draft.globalStats = globalStats;
                draft.cryptos = cryptos;
                break;
            }
            case 'setCryptos': {
                draft.cryptos = action.payload;
                break;
            }
            case 'setNews': {
                draft.news[action.payload.newsKey] = action.payload.newsValue;
                draft.cryptos = action.payload.cryptos;
                break;
            }
            case 'setCryptoItemInfo': {
                const objToAssign = {};
                objToAssign.cryptoInfo = action.payload.cryptoInfoResult;
                objToAssign.timePeriod = {};
                objToAssign.timePeriod[action.payload.timePeriod] = '';
                draft.cryptoItemInfo[action.payload.cryptoId] = objToAssign;
                break;
            }
            case 'setCryptoItemHistory': {
                draft.cryptoItemInfo[action.payload.cryptoId].timePeriod[action.payload.timePeriod] = action.payload.cryptoHistoryResult;
                break;
            }
            default:
                break;
        }
    });
};

export default rootReducer;