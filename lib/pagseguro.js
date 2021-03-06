// Generated by CoffeeScript 1.9.3
(function() {
  var pagseguro, req, xml;

  xml = require('jstoxml');

  req = require('request');

  pagseguro = (function() {
    function pagseguro(configObj) {
      if (arguments.length > 1) {
        this.email = arguments[0];
        this.token = arguments[1];
        this.mode = "payment";
        console.warn("This constructor is deprecated. Please use a single object with the config options as attributes");
      } else {
        this.email = configObj.email;
        this.token = configObj.token;
        this.mode = configObj.mode || "payment";
      }
      this.obj = {};
      this.xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
      return this;
    }

    pagseguro.prototype.currency = function(cur) {
      this.obj.currency = cur;
      return this;
    };

    pagseguro.prototype.reference = function(ref) {
      this.obj.reference = ref;
      return this;
    };

    pagseguro.prototype.addItem = function(item) {
      if (this.mode === 'sand-subscription') {
        throw new Error("This function is for payment mode only!");
      }
      if (this.obj.items == null) {
        this.obj.items = [];
      }
      this.obj.items.push({
        item: item
      });
      return this;
    };

    pagseguro.prototype.buyer = function(buyer) {
      this.obj.sender = {
        name: buyer.name,
        email: buyer.email,
        phone: {
          areaCode: buyer.phoneAreaCode,
          number: buyer.phoneNumber
        },
        documents: {
          document: {
            type: "CNPJ",
            value: buyer.cnpj
          }
        }
      };
      if (this.mode === 'sand-subscription') {
        this.obj.sender.address = {};
        if (buyer.street != null) {
          this.obj.sender.address.street = buyer.street;
        }
        if (buyer.number != null) {
          this.obj.sender.address.number = buyer.number;
        }
        if (buyer.postalCode != null) {
          this.obj.sender.address.postalCode = buyer.postalCode;
        }
        if (buyer.city != null) {
          this.obj.sender.address.city = buyer.city;
        }
        if (buyer.state != null) {
          this.obj.sender.address.state = buyer.state;
        }
        if (buyer.country != null) {
          this.obj.sender.address.country = buyer.country;
        }
        if (buyer.complement != null) {
          this.obj.sender.address.complement = buyer.complement;
        }
        if (buyer.district != null) {
          this.obj.sender.address.district = buyer.district;
        }
      }
      if (this.mode === 'subscription') {
        this.obj.sender.address = {};
        if (buyer.street != null) {
          this.obj.sender.address.street = buyer.street;
        }
        if (buyer.number != null) {
          this.obj.sender.address.number = buyer.number;
        }
        if (buyer.postalCode != null) {
          this.obj.sender.address.postalCode = buyer.postalCode;
        }
        if (buyer.city != null) {
          this.obj.sender.address.city = buyer.city;
        }
        if (buyer.state != null) {
          this.obj.sender.address.state = buyer.state;
        }
        if (buyer.country != null) {
          this.obj.sender.address.country = buyer.country;
        }
        if (buyer.complement != null) {
          this.obj.sender.address.complement = buyer.complement;
        }
        if (buyer.district != null) {
          this.obj.sender.address.district = buyer.district;
        }
      }
      return this;
    };
    
    pagseguro.prototype.paymentMethodConfigs = function(configsInfo) {
      switch (this.mode) {
        case 'payment':
          this.obj.paymentMethodConfigs = {
            paymentMethodConfig:{
              paymentMethod:{
                group:"CREDIT_CARD"
              },
              configs:{
                config:{
                  key:"MAX_INSTALLMENTS_NO_INTEREST",
                  value:6
                }
              }
            }
          };
          break;
        case 'sandbox':
          this.obj.paymentMethodConfigs = {
            paymentMethodConfig:{
              paymentMethod:{
                group:"CREDIT_CARD"
              },
              configs:{
                config:{
                  key:"MAX_INSTALLMENTS_NO_INTEREST",
                  value:6
                }
              }
            }
          };
          break;
      }
      return this;
    };
    
    pagseguro.prototype.timeout = function(time) {
      this.obj.timeout = time;
      return this;
    };

    pagseguro.prototype.shipping = function(shippingInfo) {
      switch (this.mode) {
        case 'payment':
        case 'sandbox':
          this.obj.shipping = {
            type: shippingInfo.type,
            address: {
              street: shippingInfo.street,
              number: shippingInfo.number,
              postalCode: shippingInfo.postalCode,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country
            },
            //shippingAddressRequired:false
          };
          if (shippingInfo.complement != null) {
            this.obj.shipping.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.shipping.district = shippingInfo.district;
          }
          break;
        case 'sand-subscription':
          this.obj.shipping = {
            type: shippingInfo.type,
            address: {
              street: shippingInfo.street,
              number: shippingInfo.number,
              postalCode: shippingInfo.postalCode,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country
            },
            shippingAddressRequired:false
          };
          if (shippingInfo.complement != null) {
            this.obj.shipping.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.shipping.district = shippingInfo.district;
          }
          break;
        case 'subscription':
          this.obj.shipping = {
            type: shippingInfo.type,
            address: {
              street: shippingInfo.street,
              number: shippingInfo.number,
              postalCode: shippingInfo.postalCode,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country
            },
            shippingAddressRequired:false
          };
          if (shippingInfo.complement != null) {
            this.obj.shipping.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.shipping.district = shippingInfo.district;
          }
          break;
      }
      return this;
    };

    pagseguro.prototype.preApproval = function(preApprovalInfo) {
      var maxTotalAmount, twoYearsFromNow;
      if (this.mode === 'sand-subscription') {
        twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 1);
        maxTotalAmount = preApprovalInfo.maxTotalAmount * 1 || preApprovalInfo.amountPerPayment * 12 || preApprovalInfo.maxAmountPerPayment * 12;
        this.obj.preApproval = {
          charge: preApprovalInfo.charge || 'manual',
         // maxTotalAmount: maxTotalAmount.toFixed(2)
          expiration : {
            value:preApprovalInfo.value,
            unit:"months"
          }
        };
        
        if (preApprovalInfo.name != null) {
          this.obj.preApproval.name = preApprovalInfo.name;
        }
        if (preApprovalInfo.details != null) {
          this.obj.preApproval.details = preApprovalInfo.details;
        }
        if (preApprovalInfo.period != null) {
          this.obj.preApproval.period = preApprovalInfo.period;
        }
        if (preApprovalInfo.amountPerPayment != null) {
          this.obj.preApproval.amountPerPayment = preApprovalInfo.amountPerPayment;
        }
        if (preApprovalInfo.maxAmountPerPayment != null) {
          this.obj.preApproval.maxAmountPerPayment = preApprovalInfo.maxAmountPerPayment;
        }
        if (preApprovalInfo.maxPaymentsPerPeriod != null) {
          this.obj.preApproval.maxPaymentsPerPeriod = preApprovalInfo.maxPaymentsPerPeriod;
        }
        if (preApprovalInfo.maxAmountPerPeriod != null) {
          this.obj.preApproval.maxAmountPerPeriod = preApprovalInfo.maxAmountPerPeriod;
        }
        if (preApprovalInfo.initialDate != null) {
          this.obj.preApproval.initialDate = preApprovalInfo.initialDate;
        }
      } 
      if (this.mode === 'subscription') { 
        twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 1);
        maxTotalAmount = preApprovalInfo.maxTotalAmount * 1 || preApprovalInfo.amountPerPayment * 12 || preApprovalInfo.maxAmountPerPayment * 12;
        this.obj.preApproval = {
          charge: preApprovalInfo.charge || 'manual',
         // maxTotalAmount: maxTotalAmount.toFixed(2)
          expiration : {
            value:preApprovalInfo.value,
            unit:"months"
          }
        };
        
        if (preApprovalInfo.name != null) {
          this.obj.preApproval.name = preApprovalInfo.name;
        }
        if (preApprovalInfo.details != null) {
          this.obj.preApproval.details = preApprovalInfo.details;
        }
        if (preApprovalInfo.period != null) {
          this.obj.preApproval.period = preApprovalInfo.period;
        }
        if (preApprovalInfo.amountPerPayment != null) {
          this.obj.preApproval.amountPerPayment = preApprovalInfo.amountPerPayment;
        }
        if (preApprovalInfo.maxAmountPerPayment != null) {
          this.obj.preApproval.maxAmountPerPayment = preApprovalInfo.maxAmountPerPayment;
        }
        if (preApprovalInfo.maxPaymentsPerPeriod != null) {
          this.obj.preApproval.maxPaymentsPerPeriod = preApprovalInfo.maxPaymentsPerPeriod;
        }
        if (preApprovalInfo.maxAmountPerPeriod != null) {
          this.obj.preApproval.maxAmountPerPeriod = preApprovalInfo.maxAmountPerPeriod;
        }
        if (preApprovalInfo.initialDate != null) {
          this.obj.preApproval.initialDate = preApprovalInfo.initialDate;
        }
      } 
      return this;
    };


    /*
    Configura as URLs de retorno e de notificação por pagamento
     */

    pagseguro.prototype.setRedirectURL = function(url) {
      this.obj.redirectURL = url;
      return this;
    };

    pagseguro.prototype.setNotificationURL = function(url) {
      this.obj.notificationURL = url;
      return this;
    };

    pagseguro.prototype.setReviewURL = function(url) {
      if (this.mode === "sand-subscription") {
        this.obj.reviewURL = url;
      } 
      if (this.mode === "subscription") {
        this.obj.reviewURL = url;
      } 
      return this;
    };

    pagseguro.prototype.send = function(callback) {
      var options;
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8'
        }
      };
      switch (this.mode) {
        case 'payment':
          options.uri = "https://ws.pagseguro.uol.com.br/v2/checkout?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            checkout: this.obj
          });
          break;
        case 'subscription':
          options.uri = "https://ws.pagseguro.uol.com.br/v2/pre-approvals/request?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            preApprovalRequest: this.obj
          });
          break;
        case 'sandbox':
          options.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            checkout: this.obj
          });
          break;
        case 'sand-subscription':
          options.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/pre-approvals/request?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            preApprovalRequest: this.obj
          });
          break;
          console.log("xml: "+options.body);
      }
      return req(options, function(err, res, body) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, body);
        }
      });
    };

    return pagseguro;

  })();

  module.exports = pagseguro;

}).call(this);
