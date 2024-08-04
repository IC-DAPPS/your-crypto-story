export const idlFactory = ({ IDL }) => {
  const DeleteError = IDL.Variant({
    'IndexOutOfBounds' : IDL.Null,
    'DidntFindUserData' : IDL.Null,
    'AnonymousCaller' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : DeleteError });
  const PrincipalName = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const UserData = IDL.Record({
    'owned_principals' : IDL.Vec(PrincipalName),
    'name' : IDL.Text,
    'email' : IDL.Opt(IDL.Text),
    'known_principals' : IDL.Vec(PrincipalName),
  });
  const GetUserDataError = IDL.Variant({
    'DidntFindUserData' : IDL.Null,
    'AnonymousCaller' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'Ok' : UserData, 'Err' : GetUserDataError });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : GetUserDataError });
  return IDL.Service({
    'delete_known_principal' : IDL.Func([IDL.Nat64], [Result], []),
    'delete_owned_principal' : IDL.Func([IDL.Nat64], [Result], []),
    'get_userdata' : IDL.Func([], [Result_1], ['query']),
    'insert_known_principals' : IDL.Func(
        [IDL.Vec(PrincipalName)],
        [Result_2],
        [],
      ),
    'insert_owned_principals' : IDL.Func(
        [IDL.Vec(PrincipalName)],
        [Result_2],
        [],
      ),
    'insert_userdata' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_2], []),
    'update_known_principal_name' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [Result],
        [],
      ),
    'update_owned_principal_name' : IDL.Func(
        [IDL.Text, IDL.Nat64],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
