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
            default:
                break;
        }
    });
};

export default rootReducer;