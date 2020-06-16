import { homeUrl } from '../constants';
import utils from '../utils';

function NotFoundPage(props) {
  utils.notifyWarning('Page not found.');
  props.history.push(`${homeUrl}`);
  return null;
}

export default NotFoundPage;