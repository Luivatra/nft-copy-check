function getInfoToken(idToken){
    document.getElementById("oriImageToken").src = ""
    document.getElementById("imageToken").src = ""
    url = 'https://ergolui.com/nft-check/nfthashcompares/?'
    if(idToken.includes("...")){
        idTokenParts= idToken.split("...")
        url += "copiedTokenIdStartsWith=" + idTokenParts[0] + "&copiedTokenIdEndsWith=" + idTokenParts[1]
    }
    else
    {
        url += "copiedTokenId=" + idToken
    }
    url += "&threshold=0.05"
    fetch(url)
        .then(response => response.json())
        .then(hashCompareData => {
            console.log(hashCompareData)

            if(hashCompareData.count>0){
                idToken = hashCompareData.results[0].copiedNFT.token_id
                fetch('https://api.ergoplatform.com/api/v1/tokens/' + idToken)
                .then(response => response.json())
                .then(tokenData => {
                    console.log(tokenData)

                    fetch('https://api.ergoplatform.com/api/v1/boxes/' + tokenData.boxId)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)

                        // API Values
                        let imagePath = resolveIpfs(toUtf8String(data.additionalRegisters.R9.renderedValue))
                        let idToken = data.assets[0].tokenId
                        let tituloToken = toUtf8String(data.additionalRegisters.R4.renderedValue)
                        let artworkChecksum = data.additionalRegisters.R8.renderedValue
                        let descriptionToken = toUtf8String(data.additionalRegisters.R5.renderedValue)
                        let mintInfo = "Minted on " + hashCompareData.results[0].copiedNFT.mint_time + " by " + hashCompareData.results[0].copiedNFT.mint_address
                        
                        // Display values in HMTL
                        document.getElementById("mintInfo").innerText = mintInfo
                        document.getElementById("imageToken").src = imagePath
                        document.getElementById("nameToken").innerText = tituloToken
                        document.getElementById("idToken").innerText = idToken
                        document.getElementById("descriptionToken").innerText = descriptionToken
                        document.getElementById("artworkChecksum").innerText = artworkChecksum
                        
                    })
                    .catch(error => console.error('Error:', error))
                    
                })
                .catch(error => console.error('Error:', error))
                idToken = hashCompareData.results[0].originalNFT.token_id
                fetch('https://api.ergoplatform.com/api/v1/tokens/' + idToken)
                .then(response => response.json())
                .then(tokenData => {
                    console.log(tokenData)

                    fetch('https://api.ergoplatform.com/api/v1/boxes/' + tokenData.boxId)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        document.getElementById("originalTokenText").innerText = "probably a copy of this Ergo NFT!"
                        // API Values
                        let imagePath = resolveIpfs(toUtf8String(data.additionalRegisters.R9.renderedValue))
                        let idToken = data.assets[0].tokenId
                        let tituloToken = toUtf8String(data.additionalRegisters.R4.renderedValue)
                        let artworkChecksum = data.additionalRegisters.R8.renderedValue
                        let descriptionToken = toUtf8String(data.additionalRegisters.R5.renderedValue)
                        let mintInfo = "Minted on " + hashCompareData.results[0].originalNFT.mint_time + " by " + hashCompareData.results[0].originalNFT.mint_address
                        
                        // Display values in HMTL
                        document.getElementById("oriMintInfo").innerText = mintInfo
                        document.getElementById("oriImageToken").src = imagePath
                        document.getElementById("oriNameToken").innerText = tituloToken
                        document.getElementById("oriIdToken").innerText = idToken
                        document.getElementById("oriDescriptionToken").innerText = descriptionToken
                        document.getElementById("oriArtworkChecksum").innerText = artworkChecksum
                        
                    })
                    .catch(error => console.error('Error:', error))

                })
                .catch(error => console.error('Error:', error))
            }
            else
            {
                url = 'https://ergolui.com/nft-check/nfts/?'
                if(idToken.includes("...")){
                    idTokenParts= idToken.split("...")
                    url += "tokenIdStartsWith=" + idTokenParts[0] + "&tokenIdEndsWith=" + idTokenParts[1]
                }
                else
                {
                    url += "token_id=" + idToken
                }
                fetch(url)
                    .then(response => response.json())
                    .then(nftsData => {
                        console.log(nftsData)

                        if(nftsData.count>0){
                            document.getElementById("originalTokenText").innerText = "probably not a copy of any other Ergo NFT!"
                        }
                        else
                        {
                            document.getElementById("originalTokenText").innerText = "not found in our database!"
                        }
                    })
            }
        })
        .catch(error => console.error('Error:', error))
}

function toUtf8String(hex) {
    if(!hex){ hex = ''}
    var str = ''
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return str
}

function resolveIpfs(url) {
    const ipfsPrefix = 'ipfs://'
    if (!url.startsWith(ipfsPrefix)) return url
    else return url.replace(ipfsPrefix, 'https://')+".ipfs.dweb.link"
}