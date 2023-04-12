import smartpy as sp

TTransferObject = sp.TRecord(consumerId=sp.TString, producerId=sp.TString,
                             assetId=sp.TString, timestamp=sp.TTimestamp, contractRef=sp.TAddress)


class TransferStore(sp.Contract):
    def __init__(self):
        # init map for storing data transfer data
        self.init(
            admin=sp.set([sp.address("tz1RTt21hfc9rndKcQTS1CeF5rzr8bJ5nhV5")]), dataTransferMap=sp.map(tkey=sp.TNat, tvalue=TTransferObject)
        )

    @ sp.entry_point(name="postDataTransfer")
    def postDataTransfer(self, transactionId, consumerId, producerId, assetId, contractRef):
        # check if transactionId is already used
        sp.verify(~self.data.dataTransferMap.contains(transactionId),
                  message="TransactionId already used.")
        # store data transfer data
        self.data.dataTransferMap[transactionId] = sp.record(
            consumerId=consumerId, producerId=producerId, assetId=assetId, timestamp=sp.now, contractRef=contractRef)

    @ sp.entry_point(name="getDataTransfer")
    def getDataTransfer(self, transactionId):
        # check if transactionId exists
        sp.verify(self.data.dataTransferMap.contains(transactionId))

    @ sp.entry_point(name="deleteDataTransfer")
    def deleteDataTransfer(self, transactionId):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # check if transactionId exists
        sp.verify(self.data.dataTransferMap.contains(transactionId))
        # delete data transfer data
        del self.data.dataTransferMap[transactionId]


# add compilation target
sp.add_compilation_target(
    "transferContract",
    TransferStore()
)
