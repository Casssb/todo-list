import 'sanitize.css';
import './css/styles.css';
import { viewController } from './modules/dom';
import { storageController } from './modules/storageController';

storageController.loopThroughProjects(viewController.appendProjectMarkup);
