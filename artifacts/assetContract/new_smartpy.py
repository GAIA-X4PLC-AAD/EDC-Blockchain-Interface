import smartpy as sp

@sp.module

def main():
    
    class Contract(sp.Contract):
        def __init__(self):
            self.data.administrator = sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")
            self.data.author = 'Ramon Mehrpoya'
            self.data.last_token_id = 0
            self.data.ledger = sp.big_map()
            self.data.metadata = sp.big_map({'' : sp.bytes('0x68747470733a2f2f697066732e696f2f697066732f516d556d55714643526a6354416b506753667375556d64735750524e444a6d454332737762465842363233723678')})
            self.data.token_metadata = sp.big_map()
            sp.cast(self.data, sp.record(administrator = sp.address, author = sp.string, last_token_id = sp.nat, ledger = sp.big_map[sp.nat, sp.address], metadata = sp.big_map[sp.string, sp.bytes], token_metadata = sp.big_map[sp.nat, sp.record(token_id = sp.nat, token_info = sp.map[sp.string, sp.bytes]).layout(("token_id", "token_info"))]).layout((("administrator", ("author", "last_token_id")), ("ledger", ("metadata", "token_metadata")))))

        @sp.entry_point
        def balance_of(self, params):
            sp.cast(params, sp.record(callback = sp.contract[sp.list[sp.record(balance = sp.nat, request = sp.record(owner = sp.address, token_id = sp.nat).layout(("owner", "token_id"))).layout(("request", "balance"))]], requests = sp.list[sp.record(owner = sp.address, token_id = sp.nat).layout(("owner", "token_id"))]).layout(("requests", "callback")))
            sp.cast(params.requests, sp.list[sp.record(owner = sp.address, token_id = sp.nat).layout(("owner", "token_id"))])
            @sp.effects(with_storage="read-only")
            def f_x0(_x0):
                assert self.data.token_metadata.contains(_x0.token_id), 'FA2_TOKEN_UNDEFINED'
                return sp.record(request = _x0, balance = 1 if self.data.ledger[_x0.token_id] == _x0.owner else 0)

            args = [f_x0(x0) for x0 in params.requests]
            sp.transfer(args, sp.tez(0), params.callback)

        @sp.entry_point
        def mint(self, params):
            #assert callView()
            sp.cast(params, sp.list[sp.record(metadata = sp.map[sp.string, sp.bytes], to_ = sp.address).layout(("to_", "metadata"))])
            for action in params:
                compute_asset_contract_35 = self.data.last_token_id
                self.data.token_metadata[compute_asset_contract_35] = sp.record(token_id = compute_asset_contract_35, token_info = action.metadata)
                self.data.ledger[compute_asset_contract_35] = action.to_
                self.data.last_token_id += 1

        @sp.entrypoint
        def set_administrator(self, new_administrator):
            # Ensure that only the current administrator can set a new administrator
            assert sp.sender == self.data.administrator, "FA2_NOT_ADMIN"
            self.data.administrator = new_administrator

        @sp.entrypoint
        def transfer(self, params):
            # Deny all transfers (as this contract doesn't support token transfers)
            sp.transfer(sp.record(error="FA2_TX_DENIED"), sp.mutez(0), params)

        @sp.entrypoint
        def update_operators(self, params):
            # Operators functionality not supported
            sp.transfer(sp.record(error="FA2_OPERATORS_UNSUPPORTED"), sp.mutez(0), params)


@sp.add_test()
def test():
    scenario = sp.test_scenario("Callviews", main)
    contract = main.Contract()
    scenario += contract
