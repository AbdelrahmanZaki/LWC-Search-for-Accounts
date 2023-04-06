import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import { NavigationMixin } from 'lightning/navigation';  
import { deleteRecord } from 'lightning/uiRecordApi';


const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Account ID', fieldName: 'Id' },
    { type: 'button', typeAttributes: {  
        label: 'View',  
        name: 'View',  
        title: 'View',  
        disabled: false,  
        value: 'view',  
        iconPosition: 'left'  
    } } ,
    { type: 'button', typeAttributes: {  
        label: 'Edit',  
        name: 'Edit',  
        title: 'Edit',  
        disabled: false,  
        value: 'edit',  
        iconPosition: 'left'  
    } },
    {
        type: 'button',typeAttributes: {
        label:'Delete',
        name: 'Delete',
        title:'Delete',
        disabled: false,
        value: 'delete',
        iconPosition: 'left',
    }}
];

//"name": the name of the button, used to identify it when it is clicked
//"disabled": a Boolean value that determines whether the button is disabled or not
//"value": a value that will be passed to the button click event

export default class AccountSearch extends NavigationMixin(LightningElement) {
    @track accounts;
    @track error;
    @track searchKey;

    get columns() {
        return columns;
    }

    handleRowAction(event) {  
        const recId = event.detail.row.Id;
        console.log(recId + 'Record ID');  
        const actionName = event.detail.action.name;  
        if (actionName === 'Edit') {  
            this[NavigationMixin.Navigate]({  
                type: 'standard__recordPage',  
                attributes: {  
                    recordId: recId,  
                    objectApiName: 'Account',  
                    actionName: 'edit'  
                }  
            });  
        } else if (actionName === 'View') {  
            this[NavigationMixin.Navigate]({  
                type: 'standard__recordPage',  
                attributes: {  
                    recordId: recId,  
                    objectApiName: 'Account',  
                    actionName: 'view'  
                }  
            });  
        }   else if (actionName === 'Delete') {  
            deleteRecord(recId)
            .then(() => {
                // Show success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account deleted',
                        variant: 'success'
                    })
                );
                // Refresh account list
                this.handleSearch();
            })
            .catch(error => {
                // Show error message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting account',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });  
        }         
    } 

    
    handleSearch(event) {
        this.searchKey = event.target.value;
        console.log('Searching for:', this.searchKey);
        // Call the Apex method
        searchAccounts({ searchKey: this.searchKey })
            .then(result => {
                // set the result data in the accounts property
                this.accounts = result;
            })
            .catch(error => {
                // Error handling
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Accounts',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}