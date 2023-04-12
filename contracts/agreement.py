import smartpy as sp

# ---------------------------- Contract Agreement ---------------------------- #
# transaction id as identifier
# compare hash to verify intefrity
# every entity must its own tezos account

TAgreementRecord = sp.TRecord(providerAddress=sp.TAddress, consumerAddress=sp.TAddress,
                              hash=sp.TString, timestamp=sp.TTimestamp, toVerify=sp.TAddress)


class ContractAgreement(sp.Contract):

    def __init__(self):
        self.init(admin=sp.set([sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ")]), institution="TU Berlin", unverifiedAgreements=sp.map(
            tkey=sp.TString, tvalue=TAgreementRecord), verifiedAgreements=sp.map(tkey=sp.TString, tvalue=TAgreementRecord))

    @sp.entry_point(name="postAgreement")
    def postAgreement(self, id, providerAddress, consumerAddress, hash):
        # check if contractId is already in unverifiedAgreements
        sp.if self.data.unverifiedAgreements.contains(id):
            # check if requester is toVerify
            sp.if sp.sender == self.data.unverifiedAgreements[id].toVerify:
                # check if hash is correct
                sp.if self.data.unverifiedAgreements[id].hash == hash:
                    # move agreement from unverifiedAgreements to verifiedAgreements
                    self.data.verifiedAgreements[id] = self.data.unverifiedAgreements[id]
                    del self.data.unverifiedAgreements[id]
                sp.else:
                    sp.failwith("Hash is not correct.")
            sp.else:
                sp.failwith("No permission to write to smart contract.")
        sp.else:
            # check if sender is consumer
            sp.if sp.sender == consumerAddress:
                self.data.unverifiedAgreements[id] = sp.record(
                    providerAddress=providerAddress, consumerAddress=consumerAddress, hash=hash, timestamp=sp.now, toVerify=providerAddress)
            sp.else:
                self.data.unverifiedAgreements[id] = sp.record(
                    providerAddress=providerAddress, consumerAddress=consumerAddress, hash=hash, timestamp=sp.now, toVerify=consumerAddress)

    @sp.entry_point(name="deleteVerifiedAgreement")
    def deleteVerifiedAgreement(self, id):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to delete Agreement. No admin role.")
        # check if contractId is in verifiedAgreements
        sp.if self.data.verifiedAgreements.contains(id):
            del self.data.verifiedAgreements[id]
        sp.else:
            sp.failwith("Agreement does not exist.")

    @sp.entry_point(name="addAdmin")
    def addAdmin(self, address):
        # check if sender is admin
        sp.verify(self.data.admin.contains(sp.source),
                  message="No permission to write to smart contract.")
        # add address to admin set
        self.data.admin.add(address)


# test for postAgreement entry point
@sp.add_test(name="postAgreement")
def test():
    # accounts
    consumer = sp.test_account("Consumer")
    provider = sp.test_account("Provider")
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = ContractAgreement()
    scenario += c1
    scenario.h2("Consumer creates agreement")
    scenario += c1.postAgreement(
        id="0",
        providerAddress=provider.address,
        consumerAddress=consumer.address,
        hash="testhash"
    ).run(sender=consumer)
    scenario.h2("Provider verifies agreement")
    scenario += c1.postAgreement(
        id="0",
        providerAddress=provider.address,
        consumerAddress=consumer.address,
        hash="testhash"
    ).run(sender=provider)

# test for possible attack scenario


@sp.add_test(name="postAgreement - attack")
def test():
    # accounts
    consumer = sp.test_account("Consumer")
    provider = sp.test_account("Attacker")
    attacker = sp.test_account("Attacker")
    # create test scenario
    scenario = sp.test_scenario()
    # create test contract
    c1 = ContractAgreement()
    scenario += c1
    scenario.h2("Consumer creates agreement")
    scenario += c1.postAgreement(
        id="0",
        providerAddress=provider.address,
        consumerAddress=consumer.address,
        hash="testhash"
    ).run(sender=consumer)
    scenario.h2("Provider tries to verify agreement")
    scenario += c1.postAgreement(
        id="0",
        providerAddress=provider.address,
        consumerAddress=consumer.address,
        hash="wronghash"
    ).run(valid=False, sender=attacker)


# add compilation target
sp.add_compilation_target(
    "contractAgreement",
    ContractAgreement()
)
