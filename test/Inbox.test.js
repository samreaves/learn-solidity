const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');
const INITIAL_MESSAGE = 'Hi there';

/* Initialize test variables */
let accounts;
let inbox;

beforeEach(async () => {
  /* Get a list of test accounts */
  accounts = await web3.eth.getAccounts();

  /* Deploy a contract with one of the accounts */
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send({ from: accounts[0], gas: '1000000' });

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async () => {
    const transaction = await inbox.methods.setMessage('Message changed').send({ from: accounts[0], gas: '1000000' });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Message changed');
  })
});
