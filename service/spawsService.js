const SellingPartnerAPI = require('amazon-sp-api');

(async() => {
    try {
      let sellingPartner = new SellingPartnerAPI({
        region:'eu', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
        refresh_token:'amzn1.sellerapps.app.b0a0a4b1-8538-45b5-849f-20087ff4366a' // The refresh token of your app user
      });
      let res = await sellingPartner.callAPI({
        operation:'getMarketplaceParticipations'
      });
      console.log(res);
    } catch(e){
      console.log(e);
    }
  })();