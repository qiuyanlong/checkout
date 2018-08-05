import config from '../config/config'
import fundebug from 'fundebug-javascript'

fundebug.apikey = "55a4a3fe06c59bb4ff8fe0230b20e802476473c06b09a7716ab34925e645808e";
if(config.env != 'production'){
    fundebug.silent=true
    fundebug.silentResource=true
}
function formatComponentName(vm)
{
  if (vm.$root === vm) return 'root';

  var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}

export default function(err, vm, info){

	var componentName = formatComponentName(vm);
  	var propsData = vm.$options && vm.$options.propsData;

	fundebug.notifyError(err,
	{
	      metaData:
	      {
	          componentName: componentName,
	          propsData: propsData,
	          info: info
	      }
	 });
}