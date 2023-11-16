-- Grants a DB Connection for a role
CREATE ROLE api_role WITH LOGIN PASSWORD /* PW HERE */;
GRANT CONNECT ON DATABASE postgres TO api_role;
GRANT USAGE ON SCHEMA public TO api_role;
GRANT SELECT ON TABLE emails TO api_role;