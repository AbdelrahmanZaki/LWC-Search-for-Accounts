public with sharing class AccountSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchKey) {
        String SearchQuery ='SELECT Id, Name FROM Account WHERE Name LIKE \'%'+searchKey+ '%\'';
        return Database.query(SearchQuery);
    }
}
