sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox) {
        "use strict";

        return Controller.extend("zsetnumber.controller.View1", {
            onInit: function () {

            },
            setnumber: function (oEvent) {
               
                var oModel = this.getView().getModel();
                var setnumber = this.getView().byId("sno");
                var plant = this.getView().byId("plant");
                var mno = this.getView().byId("mno");
                var sln = this.getView().byId("sln");
                var dyeisort = this.getView().byId("dyeisort");
                var dyeidesc = this.getView().byId("dyeidesc");
                var fsn = this.getView().byId("fsn").getValue();
                var oFilter = new sap.ui.model.Filter("ZfsetNo", "EQ", fsn);
                oModel.read("/SetNumberChange", {
                    filters: [oFilter],
                    urlParameters: { "$top": "500000" },
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            MessageBox.error("Data Not Found.....");
                        }
                        else if (oresponse.results.length > 0) {
                          var SetApproved =  oresponse.results[0].SetApproved;
                            if(SetApproved != ""){
                                plant.setValue(oresponse.results[0].Werks);
                                mno.setValue(oresponse.results[0].ZmcNo);
                                dyeisort.setValue(oresponse.results[0].material);
                                dyeidesc.setValue(oresponse.results[0].mat_des);
                                sln.setValue(oresponse.results[0].Zlength);
                                setnumber.setValue(oresponse.results[0].ZsetNo);
                                var oDate = new Date(oresponse.results[0].ZsetStd);
                                var oModel = {
                                    dDefaultDate: oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()
                                };
                                this.getView().setModel(new JSONModel(oModel), "oDateModel")
                            }
                            else{
                                MessageBox.show("The Set Number for Modifying is not Approved ,so kindly approve this Set Number from Management.", {
                                    title: "Warning!!!!!!",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusyDialog.close();
                        MessageBox.show("Data Not Read Successfully", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }

                })

            },  
            dyeingsort: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput1 = this.getView().byId("dyeisort");
                var oInput = this.getView().byId("dyeidesc"); 
          
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("Orderfr", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        enableBasicSearch: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Product;
                            var valueset1 = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.ProductDescription;
                            oInput1.setValue(valueset);
                            oInput.setValue(valueset1);
                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }
          
          
                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Product", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "ProductDescription", control: new sap.m.Input() })],
          
          
          
          
                    search: function (oEvt) {
                        oBusyDialog.open();
                        //  var oParams = oEvt.getParameter("YY1_PACKINGTYPE");
                        var Product = oEvt.mParameters.selectionSet[0].mProperties.value;
                        var ProductDescription = oEvt.mParameters.selectionSet[1].mProperties.value;
                        // if threee no  values 
                        if (Product === "" && ProductDescription === "") {
                            oTable.bindRows({
                                path: "/MAT_DES"
                            });
                        }
          
                        //    if BillingDocument  value is insert then search  under block
                        else if (Product === "" ) {
                            oTable.bindRows({
                                path: "/MAT_DES", filters: [
                                    new sap.ui.model.Filter("ProductDescription", sap.ui.model.FilterOperator.Contains, ProductDescription)]
                            });
                        }
          
                        //    if BillingDocumentItem  value is insert then search under block
                        else if (ProductDescription === "" ) {
                            oTable.bindRows({
                                path: "/MAT_DES", filters: [
                                    new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.Contains, Product)]
                            });
                        }
                        
                        oBusyDialog.close();
                    }
                });
          
                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Product", template: "Product" },
                        { label: "ProductDescription", template: "ProductDescription" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZDENIM_SERVICE_V2");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },
            onBack: function () {
              var sPreviousHash = History.getInstance().getPreviousHash();
              if (sPreviousHash !== undefined) {
                  window.history.go(-1);
              } else {
                  this.getOwnerComponent().getRouter().navTo("page1", null, true);
              }
            },
            SAVEDATA: function () {
                var finalsetnumber = this.getView().byId("fsn").getValue();
                var plant = this.getView().byId("plant").getValue();
                var setnumber = this.getView().byId("sno").getValue();
                var set = this.getView().byId("sln").getValue();
                var Machinenumber = this.getView().byId("mno").getValue();
                var dyeingsort = this.getView().byId("dyeisort").getValue();
                var dyeingdesc = this.getView().byId("dyeidesc").getValue();
                var setlength = parseFloat(set).toFixed(2);
                if (plant === '') {
                    MessageBox.error("Please Select Plant");
                }
                else if (setnumber === '') {
                    MessageBox.error("Please Enter Set Number");
                }
                else if (setlength === '') {
                    MessageBox.error("Please Enter Set Length Number");
                }
                else if (Machinenumber === '') {
                    MessageBox.error("Please Enter Machine Number");
                }
                else if (finalsetnumber === '') {
                    MessageBox.error("Please Enter Final Set No.");
                }else if (dyeingsort === '') {
                    MessageBox.error("Please Enter Dyeing Sort");
                }
                else {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();

                var oModel1 = this.getView().getModel();
                var date = this.getView().byId("date").getValue();
                var oDate = new Date(date);
                var oDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var oDate2 = oDate1.toISOString().slice(0, 16);


                var items = {
                    Werks: plant,
                    ZmcNo: Machinenumber,
                    ZsetNo: setnumber,
                    ZfsetNo: finalsetnumber,
                    ZfnDate: oDate2,
                    Zlength: setlength,
                    ZsetStd: oDate2,
                    mat_des:dyeingdesc,
                    material:dyeingsort
                }
                oModel1.update("/SetNumberChange(Werks='" + plant + "',ZmcNo='" + Machinenumber + "',ZsetNo='" + setnumber + "',ZfsetNo='" + finalsetnumber + "')", items, {
                    success: function (ores) {
                        oBusyDialog.close();
                        MessageBox.show("Data Update Succesfully", {
                            title: "information",
                            icon: MessageBox.Icon.SUCCESS,
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    window.location.reload();
                                }
                            }

                        });
                    }.bind(this),
                    error: function (ores) {
                        oBusyDialog.close();
                        MessageBox.error("Data Not Upload");
                    }.bind(this)
                })
            }
            },
        });
    });
