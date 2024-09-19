import smartpy as sp

TTransferObject = sp.TRecord(agreementId=sp.TString, assetId=sp.TString,
                             consumerId=sp.TString, providerId=sp.TString, timestamp=sp.TTimestamp)


class TransferLogs(sp.Contract):
    def __init__(self):
        # init map for storing data transfer data
        self.init(
            admin=sp.set([sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL")]), institution="TU Berlin", transferMap=sp.map(tkey=sp.TString, tvalue=TTransferObject)
        )

    @ sp.entry_point(name="postDataTransfer")
    def postDataTransfer(self, transferId, agreementId, assetId, consumerId, providerId):
        # check if transferId is already used
        sp.verify(~self.data.transferMap.contains(transferId),
                  message="transferId already used.")
        # store data transfer data
        self.data.transferMap[transferId] = sp.record(
            agreementId=agreementId, assetId=assetId, consumerId=consumerId, providerId=providerId, timestamp=sp.now)

    @ sp.entry_point(name="getDataTransfer")
    def getDataTransfer(self, transferId):
        # check if transferId exists
        sp.verify(self.data.transferMap.contains(transferId))

    @ sp.entry_point(name="deleteDataTransfer")
    def deleteDataTransfer(self, transferId):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # check if transferId exists
        sp.verify(self.data.transferMap.contains(transferId))
        # delete data transfer data
        del self.data.transferMap[transferId]

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
    c1 = TransferLogs()
    scenario += c1
    scenario.h1("Create Transfer Object")
    scenario += c1.postDataTransfer(
        transferId="0",
        agreementId="agreementId",
        assetId="assetId",
        consumerId="consumerId",
        providerId="providerId"
    ).run(sender=sp.address("tz1W6FF4j95sA7JBgV35Q2n7mDFkXYwmCUVL"))
    scenario.p("Following data object was inserted:")
    scenario.show(c1.data.transferMap["0"])
    # check if data is stored correctly
    scenario.verify(c1.data.transferMap["0"].agreementId == "agreementId")
    scenario.verify(c1.data.transferMap["0"].assetId == "assetId")
    scenario.verify(c1.data.transferMap["0"].consumerId == "consumerId")


# test for addAdmin entry point
@ sp.add_test(name="addAdmin")
def test():
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = TransferLogs()
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
sp.add_compilation_target("transfer_logs", TransferLogs())
