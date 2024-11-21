import smartpy as sp

class Policy(sp.Contract):
    def __init__(self):
        self.init_type(sp.TRecord(
            administrator = sp.TAddress,
            author = sp.TString,
            last_token_id = sp.TNat,
            ledger = sp.TBigMap(sp.TNat, sp.TAddress),
            metadata = sp.TBigMap(sp.TString, sp.TBytes),
            token_metadata = sp.TBigMap(sp.TNat, sp.TRecord(
                token_id = sp.TNat,
                token_info = sp.TMap(sp.TString, sp.TBytes)
            ).layout(("token_id", "token_info")))
        ).layout((("administrator", ("author", "last_token_id")), ("ledger", ("metadata", "token_metadata")))))
        
        self.init(
            administrator = sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL'),
            author = 'Johann Hartmann, Ramon Mehrpoya',
            last_token_id = 0,
            ledger = sp.big_map(tkey=sp.TNat, tvalue=sp.TAddress),
            metadata = sp.big_map({'': sp.bytes('0x68747470733a2f2f697066732e696f2f697066732f516d556d55714643526a6354416b506753667375556d64735750524e444a6d454332737762465842363233723678')}),
            token_metadata = sp.big_map()
        )

    @sp.entry_point
    def balance_of(self, params):
        sp.set_type(params, sp.TRecord(callback = sp.TContract(sp.TList(sp.TRecord(balance = sp.TNat, request = sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))).layout(("request", "balance")))), requests = sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id")))).layout(("requests", "callback")))
        sp.set_type(params.requests, sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))))
        def f_x0(_x0):
            sp.verify(self.data.token_metadata.contains(_x0.token_id), 'FA2_TOKEN_UNDEFINED')
            sp.result(sp.record(request = _x0, balance = sp.eif(self.data.ledger[_x0.token_id] == _x0.owner, 1, 0)))
        sp.transfer(params.requests.map(sp.build_lambda(f_x0)), sp.tez(0), params.callback)

    @sp.entry_point
    def mint(self, params):
        present = sp.view("present", sp.address('KT1FmkBCmA1TEVPWfyVN7GvMumvasnTtmbMr'), sp.unit, sp.TBool).open_some("View not found")
        sp.verify(present == True, 'FA2_NOT_ADMIN')
        sp.set_type(params, sp.TList(sp.TRecord(metadata = sp.TMap(sp.TString, sp.TBytes), to_ = sp.TAddress).layout(("to_", "metadata"))))
        sp.for action in params:
            compute_asset_contract_35 = sp.local("compute_asset_contract_35", self.data.last_token_id)
            self.data.token_metadata[compute_asset_contract_35.value] = sp.record(token_id = compute_asset_contract_35.value, token_info = action.metadata)
            self.data.ledger[compute_asset_contract_35.value] = action.to_
            self.data.last_token_id += 1

    @sp.entry_point
    def set_administrator(self, params):
        sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
        self.data.administrator = params

    @sp.entry_point
    def transfer(self, params):
        sp.set_type(params, sp.TList(sp.TRecord(from_ = sp.TAddress, txs = sp.TList(sp.TRecord(amount = sp.TNat, to_ = sp.TAddress, token_id = sp.TNat).layout(("to_", ("token_id", "amount"))))).layout(("from_", "txs"))))
        sp.failwith('FA2_TX_DENIED')

    @sp.entry_point
    def update_operators(self, params):
        sp.set_type(params, sp.TList(sp.TVariant(add_operator = sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id"))), remove_operator = sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id")))).layout(("add_operator", "remove_operator"))))
        sp.failwith('FA2_OPERATORS_UNSUPPORTED')

    #@sp.entry_point
    #def check_whitelist(self, providerAddress):
    #    #present = sp.view("present", providerAddress, sp.unit, t = sp.TRecord(balance = sp.TBool)).open_some("View not found")
    #    present = sp.view("present", sp.address('KT1FmkBCmA1TEVPWfyVN7GvMumvasnTtmbMr'), sp.unit, sp.TBool).open_some("View not found")
    #    sp.verify(present == True, 'FA2_NOT_ADMIN')


@sp.add_test(name = "Whitelist")
def test():
    scenario = sp.test_scenario()
    c2 = Policy()
    scenario += c2
    #scenario += c2.check_whitelist(c1.address).run(source=sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL'))
    # see artifacts\combined_contract.py for the combined test