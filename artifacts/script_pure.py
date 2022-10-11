# ---------------------------------------------------------------------------- #
#                FA2 implementation using SmartPy Exmperimental                #
#                  https://smartpy.io/docs/guides/FA/FA2_lib/                  #
# ---------------------------------------------------------------------------- #

import smartpy as sp
FA2 = sp.io.import_script_from_url("https://smartpy.io/templates/fa2_lib.py")


class ExampleFa2Nft(FA2.Admin, FA2.Fa2Nft):
    def __init__(self, admin, metadata, metadata_base):
        # no token transfer allowed
        FA2.Fa2Nft.__init__(
            self, metadata, metadata_base=metadata_base, policy=FA2.NoTransfer())
        FA2.Admin.__init__(self, admin)
        # modify initial contract storage for testing
        self.update_initial_storage(
            author="Johann Hartmann",
        )
    # customize mint entry point

    @sp.entry_point
    def mint(self, batch):
        sp.set_type(
            batch,
            sp.TList(
                sp.TRecord(
                    to_=sp.TAddress,
                    metadata=sp.TMap(sp.TString, sp.TBytes),
                ).layout(("to_", "metadata"))
            ),
        )
        # anyone can mint in this case
        with sp.for_("action", batch) as action:
            token_id = sp.compute(self.data.last_token_id)
            metadata = sp.record(token_id=token_id, token_info=action.metadata)
            self.data.token_metadata[token_id] = metadata
            self.data.ledger[token_id] = action.to_
            self.data.last_token_id += 1


sp.add_compilation_target(
    # metadata json file should be generated under the name "metadata_base" which will contain the offchain views as well
    "policyContract",
    ExampleFa2Nft(admin=sp.address("tz1Na21NimuuPXcQdHUk2en2XWYe9McyDDgZ"), metadata=sp.utils.metadata_of_url(
        "https://ipfs.io/ipfs/QmQ5QFcUzWJhrDLEzsyaq7hxFXNDHsTQBYqi7EARY9d98H"), metadata_base={
            "name": "gaia.tub.assets",
            "version": "1.0.0",
            "description": "NFT contract for ipfs asset management",
            "interfaces": ["TZIP-012", "TZIP-016"],
            "authors": ["Technische Universität Berlin", "Information Systems Engineering", "Johann Hartmann"],
            "homepage": "https://www.ise.tu-berlin.de/menue/projekte/",
            "source": {
                "tools": ["SmartPy"],
                "location": "https://gitlab.com/SmartPy/smartpy/-/raw/master/python/templates/FA2.py"
            },
            "permissions": {
                "receiver": "owner-no-hook",
                "sender": "owner-no-hook"
            }
    })
)
