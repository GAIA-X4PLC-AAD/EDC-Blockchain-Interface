# Smart Contract Motivation

## Contract Agreement

In order to ensure the integrity of a transfer agreement another smart contract is implemented which requires confirmation of all involved entities. We distinguish between unverified and verified agreements including following information:

```python
TAgreementRecord = sp.TRecord(providerAddress=sp.TAddress, consumerAddress=sp.TAddress,
                              hash=sp.TString, timestamp=sp.TTimestamp, toVerify=sp.TAddress)
```

These agreement records are stored in a map identifiable with the according transaction id:

```python
verifiedAgreements=sp.map(tkey=sp.TString, tvalue=TAgreementRecord)
```

The entrypoint **postAgreement** can be can be called from the provider, but also from the consumer. Depending on the caller type, the _toVerify_ address determines which address must confirm this entry.

If the required account confirms this entry with the correct hash, the aggrement record will be moved from the unverified to the verified map.

> In the current mvp implementation it is not ensured that each entity owns an individual tezos account.
