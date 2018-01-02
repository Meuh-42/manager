(function () {
    "use strict";

    angular.module("ovh-angular-contact").constant("CONTACT_EDITION", {
        SORTED_FIELDS_DEFAULT: {
            generalInformations: ["gender", "address.country", "legalForm", "firstName", "lastName", "nationality", "language"],
            legal: ["organisationType", "organisationName", "companyNationalIdentificationNumber", "associationNationalIdentificationNumber", "vat"],
            profile: ["address.line1", "address.line2", "address.line3", "address.otherDetails", "address.zip", "address.city", "address.province", "birthDay", "birthZip", "birthCity", "birthCountry"],
            contacts: ["email", "emailConfirmation", "nationalIdentificationNumber", "phone", "cellPhone", "fax"]
        },
        ALWAYS_VISIBLE_FIELDS_DEFAULT: [
            "address.country",
            "legalForm",
            "firstName",
            "lastName",
            "email",
            "emailConfirmation",
            "gender",
            "nationality",
            "organisationType",
            "organisationName",
            "companyNationalIdentificationNumber",
            "vat",
            "address.line1",
            "address.line2",
            "address.line3",
            "address.otherDetails",
            "address.zip",
            "address.city",
            "address.province",
            "birthDay",
            "birthZip",
            "birthCity",
            "birthCountry",
            "nationalIdentificationNumber",
            "phone",
            "cellPhone",
            "fax",
            "language"
        ]
    }).constant("CONTACT_PROTOTYPE_PATH", [
        "organisationName",
        "vat",
        "spareEmail",
        "email",
        "birthDay",
        "phone",
        "cellPhone",
        "fax",
        "id",
        "firstName",
        "lastName",
        "address.country",
        "address.line1",
        "address.line2",
        "address.line3",
        "address.otherDetails",
        "address.zip",
        "address.city",
        "address.province",
        "gender",
        "language",
        "organisationType",
        "legalForm",
        "birthCity",
        "birthZip",
        "birthCountry",
        "nationality",
        "nationalIdentificationNumber",
        "companyNationalIdentificationNumber",
        "emailConfirmation"
    ]).constant("CONTACT_EMAIL_REGEX", "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$");
})();