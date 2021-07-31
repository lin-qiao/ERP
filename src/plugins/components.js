import TableCom from '../components/table/table.jsx'
import Toolbar from '../components/views/toolBar.vue'

export default {
    install: app => {
		app.component('TableCom', TableCom);
		app.component('Toolbar', Toolbar);
    }
};