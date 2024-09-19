import smartpy as sp

class Contract(sp.Contract):
    def __init__(self):
        self.init_type(sp.TRecord(administrator = sp.TAddress, author = sp.TString, operators = sp.TSet(sp.TAddress)))
        self.init(administrator = sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL'),
                  author = 'Ramon Mehrpoya',
                  operators = sp.set([sp.address('tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL')]))

    @sp.entry_point
    def add_operator(self, params):
        sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
        self.data.operators.add(params)

    @sp.entry_point
    def del_operator(self, params):
        sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
        self.data.operators.remove(params)

@sp.add_test(name="addOperator")
def test():
    scenario = sp.test_scenario()
    c1 = Contract()
    scenario += c1
    scenario += c1.add_operator(
        sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")
    ).run(sender=sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL"))#Should pass
    #    sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")
    #).run(sender=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))#Should fail
    scenario.verify(c1.data.operators.contains(
        sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")))

sp.add_compilation_target("test", Contract())
