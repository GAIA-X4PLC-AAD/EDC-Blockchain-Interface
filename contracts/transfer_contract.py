import smartpy as sp

# required data object for invoices
TInvoiceObject = sp.TRecord(customerId=sp.TString, customerName=sp.TString, customerGaiaId=sp.TString,
                            customerInvoiceAddress=sp.TString, invoiceDate=sp.TString, paymentTerm=sp.TString, currency=sp.TString)

TTransferObject = sp.TRecord(consumerId=sp.TString, providerId=sp.TString,
                             assetId=sp.TString, timestamp=sp.TTimestamp, contractRef=sp.TAddress)


class TransferStore(sp.Contract):
    def __init__(self):
        # init map for storing data transfer data
        self.init(
            admin=sp.set([sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ")]), institution="TU Berlin", dataTransferMap=sp.map(tkey=sp.TString, tvalue=TTransferObject), invoiceMap=sp.map(tkey=sp.TString, tvalue=TInvoiceObject)
        )

    @ sp.entry_point(name="postDataTransfer")
    def postDataTransfer(self, transferId, consumerId, providerId, assetId, contractRef, customerName, customerGaiaId, customerInvoiceAddress, invoiceDate, paymentTerm, currency):
        # check if transferId is already used
        sp.verify(~self.data.dataTransferMap.contains(transferId),
                  message="transferId already used.")
        # store data transfer data
        self.data.dataTransferMap[transferId] = sp.record(
            consumerId=consumerId, providerId=providerId, assetId=assetId, timestamp=sp.now, contractRef=contractRef)

        # store invoice data
        self.data.invoiceMap[transferId] = sp.record(customerId=consumerId, customerName=customerName, customerGaiaId=customerGaiaId,
                                                     customerInvoiceAddress=customerInvoiceAddress, invoiceDate=invoiceDate, paymentTerm=paymentTerm, currency=currency)

    @ sp.entry_point(name="getDataTransfer")
    def getDataTransfer(self, transferId):
        # check if transferId exists
        sp.verify(self.data.dataTransferMap.contains(transferId))

    @ sp.entry_point(name="deleteDataTransfer")
    def deleteDataTransfer(self, transferId):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # check if transferId exists
        sp.verify(self.data.dataTransferMap.contains(transferId))
        # delete data transfer data
        del self.data.dataTransferMap[transferId]

    @ sp.entry_point(name="addAdmin")
    def addAdmin(self, address):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # add address to admin set
        self.data.admin.add(address)

# test for postDataTransfer entry point


@ sp.add_test(name="postDataTransfer")
def test():
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = TransferStore()
    scenario += c1
    scenario.h1("Create Transfer Object")
    scenario += c1.postDataTransfer(
        transferId="0",
        consumerId="consumer",
        providerId="provider",
        assetId="asset",
        contractRef=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"),
        customerName="customerName",
        customerGaiaId="customerGaiaId",
        customerInvoiceAddress="invoice_placeholder",
        invoiceDate="2023-04-18",
        paymentTerm="specifyPaymentTerms",
        currency="EUR"
    ).run(sender=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))
    scenario.p("Following data object was inserted:")
    scenario.show(c1.data.dataTransferMap["0"])
    # check if data is stored correctly
    scenario.verify(c1.data.dataTransferMap["0"].consumerId == "consumer")
    scenario.verify(c1.data.dataTransferMap["0"].providerId == "provider")
    scenario.verify(c1.data.dataTransferMap["0"].assetId == "asset")
    scenario.verify(c1.data.dataTransferMap["0"].contractRef == sp.address(
        "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))

# test for deleteDataTransfer entry point


@ sp.add_test(name="deleteDataTransfer")
def test():
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = TransferStore()
    # add contract to scenario
    scenario += c1
    # add test data
    scenario += c1.postDataTransfer(
        transferId="0",
        consumerId="consumer",
        providerId="provider",
        assetId="asset",
        contractRef=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"),
        customerName="customerName",
        customerGaiaId="customerGaiaId",
        customerInvoiceAddress="invoice_placeholder",
        invoiceDate="2023-04-18",
        paymentTerm="specifyPaymentTerms",
        currency="EUR"
    ).run(sender=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))
    # check if data is stored correctly
    scenario.verify(c1.data.dataTransferMap["0"].consumerId == "consumer")
    scenario.verify(c1.data.dataTransferMap["0"].providerId == "provider")
    scenario.verify(c1.data.dataTransferMap["0"].assetId == "asset")
    scenario.verify(c1.data.dataTransferMap["0"].contractRef == sp.address(
        "tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))
    # delete data transfer data
    scenario += c1.deleteDataTransfer("0").run(
        sender=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))
    # check if data is deleted
    scenario.verify(~c1.data.dataTransferMap.contains("0"))


# test for addAdmin entry point
@ sp.add_test(name="addAdmin")
def test():
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = TransferStore()
    # add contract to scenario
    scenario += c1
    # add test data
    scenario += c1.addAdmin(
        sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDMgZ")
    ).run(sender=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"))
    # check if address is added to admin set
    scenario.verify(c1.data.admin.contains(
        sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDMgZ")))


# add compilation target
sp.add_compilation_target(
    "transferContract",
    TransferStore()
)
