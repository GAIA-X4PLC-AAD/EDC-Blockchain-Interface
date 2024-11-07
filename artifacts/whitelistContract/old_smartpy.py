import smartpy as sp

class Whitelist(sp.Contract):
    def __init__(self):
        self.init_type(sp.TRecord(
            administrator = sp.TAddress, 
            author = sp.TString, 
            operators = sp.TSet(sp.TAddress)))
        self.init(administrator = sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL'), author = "Ramon Mehrpoya", operators = sp.set([sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')]))
            
    @sp.entry_point
    def add_operator(self, params):
        sp.verify(sp.sender == self.data.administrator, "FA2_NOT_ADMIN")
        self.data.operators.add(params)

    @sp.entry_point
    def del_operator(self, params):
        sp.verify(sp.sender == self.data.administrator, "FA2_NOT_ADMIN")
        self.data.operators.remove(params)

    @sp.onchain_view()
    def present(self):
        sp.result(self.data.operators.contains(sp.source))

@sp.add_test(name = "Whitelist")
def test():
    scenario = sp.test_scenario()
    
    c1 = Whitelist()
    scenario += c1
    admin = sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')
    scenario += c1.del_operator(sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')).run(sender=admin)
    scenario += c1.add_operator(sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')).run(sender=admin)
    # see artifacts\combined_contract.py for the combined test
