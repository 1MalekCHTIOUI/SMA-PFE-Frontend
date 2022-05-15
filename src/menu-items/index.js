import { dashboard } from './dashboard';
import { utilities } from './utilities';
import { chat } from './chat';
import { management } from './management';
import { other } from './other';
import { useSelector } from 'react-redux';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    items: [dashboard, chat, management]
};

export default menuItems;
