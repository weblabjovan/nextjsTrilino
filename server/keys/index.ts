import prod from './prod';
import dev from './dev';

let keys = null;

if (process.env.NODE_ENV === 'production') {
	keys = prod;
}else{
	keys = dev;
}

export default keys;