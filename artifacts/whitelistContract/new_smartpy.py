import smartpy as sp

@sp.module

def main(): 

    t: type = sp.record(administrator = sp.address, author = sp.string, operators = sp.set[sp.address])
    
    class Contract(sp.Contract):
        def __init__(self):
            self.data.administrator = sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')
            self.data.author = "Ramon Mehrpoya"
            self.data.operators = {sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')}
            

        @sp.entry_point
        def add_operator(self, params):
            #assert sp.sender == self.data.administrator, "FA2_NOT_ADMIN"
            self.data.operators.add(params)

        @sp.entry_point
        def del_operator(self, params):
            assert sp.sender == self.data.administrator, "FA2_NOT_ADMIN"
            self.data.operators.remove(params)

        @sp.onchain_view
        def present(self, params):
            #sp.cast(params, sp.address)
            return self.data.operators.contains(params)  


@sp.add_test()
def test():
    scenario = sp.test_scenario("Callviews", main)
    contract = main.Contract()
    scenario += contract
    
    contract.add_operator(sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))#.run(sp.sender == sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL"))
    
    scenario.verify(contract.data.operators.contains(sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")))
    scenario.verify(contract.data.operators.contains(sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ")))

    scenario.verify(contract.isAllowed(sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")))

