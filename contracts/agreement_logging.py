import smartpy as sp

# required data object for invoices
TInvoiceObject = sp.TRecord(customerId=sp.TString, providerId=sp.TString, agreementId=sp.TString, contractRef=sp.TString, customerName=sp.TString, customerGaiaId=sp.TString,
                            customerInvoiceAddress=sp.TString, invoiceDate=sp.TString, paymentTerm=sp.TString, currency=sp.TString)


class AgreementLogging(sp.Contract):
    def __init__(self):
        # init map for storing data transfer data
        self.init(
            admin=sp.set([sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")]), institution="TU Berlin", invoiceMap=sp.map(tkey=sp.TString, tvalue=TInvoiceObject)
        )

    @ sp.entry_point(name="postAgreementLog")
    def postAgreementLog(self, transferId, customerId, providerId, agreementId, contractRef, customerName, customerGaiaId, customerInvoiceAddress, invoiceDate, paymentTerm, currency):
        # check if transferId is already used
        sp.verify(~self.data.invoiceMap.contains(transferId),
                  message="transferId already used.")

        # store invoice data
        self.data.invoiceMap[transferId] = sp.record(customerId=customerId, providerId=providerId, agreementId=agreementId, contractRef=contractRef, customerName=customerName,
                                                     customerGaiaId=customerGaiaId, customerInvoiceAddress=customerInvoiceAddress, invoiceDate=invoiceDate, paymentTerm=paymentTerm, currency=currency)

    @ sp.entry_point(name="getInvoice")
    def getInvoice(self, transferId):
        # check if transferId exists
        sp.verify(self.data.invoiceMap.contains(transferId))

    @ sp.entry_point(name="deleteInvoice")
    def deleteInvoice(self, transferId):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # check if transferId exists
        sp.verify(self.data.invoiceMap.contains(transferId))
        # delete data transfer data
        del self.data.invoiceMap[transferId]

    @ sp.entry_point(name="addAdmin")
    def addAdmin(self, address):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # add address to admin set
        self.data.admin.add(address)

# test for addAdmin entry point


@ sp.add_test(name="addAdmin")
def test():
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = AgreementLogging()
    # add contract to scenario
    scenario += c1
    # add test data
    scenario += c1.addAdmin(
        sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDMgZ")
    ).run(sender=sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL"))
    # check if address is added to admin set
    scenario.verify(c1.data.admin.contains(
        sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDMgZ")))


# add compilation target
sp.add_compilation_target(
    "agreement_logging",
    AgreementLogging()
)
