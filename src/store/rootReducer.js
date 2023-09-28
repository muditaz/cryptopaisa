import { DEFAULT_NEWS_CATEGORY } from "../constants/constants";
import initialState from "./initialState";
import { produce } from "immer";

const rootReducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch(action.type) {
            case 'setGlobalStatsCryptosNews': {
                const { globalStatsAndCryptos, defaultNews } = action.payload;
                const { stats, coins } = globalStatsAndCryptos.data;
                const { value } = defaultNews;
                draft.globalStats = stats;
                if(!draft.cryptos || draft.cryptos.length < coins.length){
                    draft.cryptos = coins;
                }
                if(!draft.news[DEFAULT_NEWS_CATEGORY] || draft.news[DEFAULT_NEWS_CATEGORY].length < value.length) {
                    draft.news[DEFAULT_NEWS_CATEGORY] = value;
                }
                break;
            }
            case 'setCryptos': {
                draft.cryptos = action.payload;
                break;
            }
            case 'setNews': {
                if(action.payload.globalStats) {
                    draft.globalStats = action.payload.globalStats;
                }
                draft.news[action.payload.keyName] = action.payload.value;
                draft.cryptos = action.payload.cryptos;
                break;
            }
            default:
                break;
        }
    });
};

export default rootReducer;