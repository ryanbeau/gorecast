import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//  Configure Enzyme to use the React 16 adapter for all tests
configure({ adapter: new Adapter() });