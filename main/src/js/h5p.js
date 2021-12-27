// import $ from "jquery";
import preparePage, {
    mathQuillifyAll,
    mathQuillify
} from "./preparePage.js";


// create echo
function handleMessage(event) {
    // console.log('message received: ' + event.data);
    if (event.data == 'SignalToMainEvent') {
        // console.info('RECEIVE MESSAGE SignalToMainEvent (main.js)');
        // console.info('POST MESSAGE echoFromMainEvent (main.js)');
        event.target.postMessage('echoFromMainEvent', event.origin);
    }
}


export function h5pPrepare() {
    // make sensitive for preparePageEvent
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('RECEIVE preparePageEvent');
        preparePage();
    });
    // eslint-disable-next-line no-undef, no-unused-vars
    H5P.jQuery(document).on('mathquillifyAllEvent', function (_ev) {
        mathQuillifyAll();
    });
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('mathquillifyEvent', function (_ev, id) {
        // console.info('RECEIVE mathquillifyEvent(id) (main.js)' + id);
        mathQuillify(id);
    });
    // eslint-disable-next-line no-undef, no-unused-vars
    H5P.jQuery(document).on('testEvent', function (_ev) {
        console.info('RECEIVE testEvent (main.js)');
    });
    // console.info('LISTEN to testEvent (main.js)');

    window.addEventListener('message', handleMessage, false); //bubbling phase
    // window.addEventListener('message', handleMessage, true); //capturing phase
    // console.info('LISTEN to message (main.js)');
    // console.info('LISTEN to preparePageEvent and mathquillifyEvent(id) (main.js)');
    // TODO this code causes bugs:
    // eslint-disable-next-line no-undef
    var lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
    return { lang: lang };
}