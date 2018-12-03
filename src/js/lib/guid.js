define(
    'Guid',
    [],
    function () {

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        var Guid = {

            empty: function () {
                return '00000000-0000-0000-0000-000000000000';
            },
            newGuid: function () {
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
            },
            newId: function () {
                return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toLowerCase();
            }
        };
        return Guid;
    }
);