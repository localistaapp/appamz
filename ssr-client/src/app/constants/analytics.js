
import axios from 'axios';
export const track = (storeId,metric) => {
    axios.post(`/track`, {storeId: storeId,
        metric: metric}).then((response) => {
    }); 
} 