import { configure, observable, action } from 'mobx';
import Web3 from 'web3';
import axios from 'axios';

configure({ enforceActions: 'always' }); // don't allow state modifications outside actions

class NetworkStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  @observable hello = 'gello';
  @observable web3 = null;

  @observable response = {};
  /**
   * status
   * -1 idle
   * 0 loading
   * 2** success
   * 4** or 5** fail
   */
  @observable status = 200;
  @observable receiver = 'asdfasd';
  @observable speed = 0;
  @action
  init() {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
    this.web3 = web3;
    window.web3 = web3;
  }
  @action
  setResponse(value) {
    this.response = value;
  }
  @action
  setStatus(value) {
    this.status = value;
  }
  @action
  poll() {
    // const finishedOrNot = async () => {
    //   const request = await axios.get();
    // };
    const interval = setInterval(() => {
      axios.get('http://')
        .then((res) => {
          const { status } = res;
          this.setStatus(status);
          this.setResponse(res);
          clearInterval(interval);
        })
        .catch((err) => { console.log(err); });
    }, 3000);
  }
  @action
  async send(amount, receiver, speed) {
    const web3 = new Web3(); // no need provider

    const privateKey = '0x';

    const sender = '0x';
    const receiver = '0x';
    const token = '0x';
    const sendAmount = 100;
    const feeAmount = 1;
    const nonce = Math.floor(Math.random() * 10);

    const hash = web3.utils.soliditySha3(
      '0x15420b71',
      token,
      receiver,
      sendAmount,
      feeAmount,
      nonce,
    );
    const signature = web3.eth.accounts.sign(hash, privateKey);

    const payload = {
      sender,
      receiver,
      token,
      feeAmount,
      sendAmount,
      nonce,
      signature,
    };
    this.receiver = receiver;
    this.amount = amount;
    this.speed = speed;
    this.setStatus('0');
    // send transaction
    // axios.post('http://', {
    //   amount: this.amount,
    //   to: this.receiver,
    // });

    // start polling
    this.poll();
  }
}

export default NetworkStore;