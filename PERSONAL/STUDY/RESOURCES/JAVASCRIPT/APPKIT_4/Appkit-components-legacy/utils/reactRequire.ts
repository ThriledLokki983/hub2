
 let ReactDOM: any;
 try {
     ReactDOM = require('react-dom/client');
 } catch (error) {
     ReactDOM = require('react-dom');
 }
export default function Render (containid:any,node:any){

    if (ReactDOM.createRoot) {
        ReactDOM.createRoot(containid).render(node);
    } else if(ReactDOM.render) {
        ReactDOM.render(node,containid);
    }

}