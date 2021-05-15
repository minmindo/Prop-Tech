DROP SCHEMA IF EXISTS PropTech_Test_DB;
CREATE SCHEMA PropTech_Test_DB;
USE PropTech_Test_DB;

CREATE TABLE user (
  user_id VARCHAR(45) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE utility_account (
  account_id VARCHAR(45) NOT NULL,
  user_id VARCHAR(45) NOT NULL,
  PRIMARY KEY (account_id),
  UNIQUE KEY (account_id),
  KEY idx_account_id(account_id),
  KEY idx_fk_user_id (user_id),
  CONSTRAINT idx_fk_user_id 
	FOREIGN KEY (user_id) 
    REFERENCES user(user_id) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE property (
	property_id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(45) NOT NULL,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    property_type ENUM('commercial', 'residential') NOT NULL,
    total_footage FLOAT NOT NULL,
    landlord_phone VARCHAR(14) NOT NULL,
    PRIMARY KEY (property_id),
    UNIQUE KEY (property_id),
    KEY idx_property_id (property_id),
    KEY idx_fk_2_user_id (user_id),
    CONSTRAINT idx_fk_2_user_id
		FOREIGN KEY (user_id)
        REFERENCES user(user_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE meter (
  meter_id VARCHAR(45) NOT NULL,
  property_id INT NOT NULL,
  PRIMARY KEY (meter_id, property_id),
  UNIQUE KEY (meter_id, property_id),
  KEY idx_meter_id(meter_id),
  KEY idx_fk_property_id(property_id),
  CONSTRAINT idx_fk_property_id
	FOREIGN KEY (property_id)
    REFERENCES property(property_id)
    ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE bill (
  bill_id INT NOT NULL AUTO_INCREMENT,
  account_id VARCHAR(45) NOT NULL,
  meter_id VARCHAR(45) NOT NULL,
  m_kwh_usage FLOAT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  m_charge FLOAT NOT NULL,
  s_kwh_usage FLOAT,
  s_charge FLOAT,
  total_kwh_usage FLOAT NOT NULL,
  total_charge FLOAT NOT NULL,
  unit_charge FLOAT NOT NULL,
  PRIMARY KEY (bill_id),
  KEY idx_fk_account_id (account_id),
  KEY idx_fk_meter_id (meter_id),
  CONSTRAINT account_id 
	FOREIGN KEY (account_id) 
	REFERENCES utility_account(account_id) ON DELETE CASCADE,
  CONSTRAINT meter_id
	FOREIGN KEY (meter_id)
    REFERENCES meter(meter_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tenant (
	tenant_id INT NOT NULL AUTO_INCREMENT,
    property_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    landlord_phone VARCHAR(14) NOT NULL,
    rubs FLOAT NOT NULL,
    PRIMARY KEY(tenant_id),
    UNIQUE KEY(tenant_id, email),
    KEY idx_tenant_id (tenant_id),
    KEY idx_email(email),
    KEY idx_fk_2_property_id(property_id),
    CONSTRAINT idx_fk_2_property_id
		FOREIGN KEY (property_id)
        REFERENCES property(property_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE invoice (
	invoice_id INT NOT NULL AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    prior_read FLOAT,
    cur_read FLOAT,
    rubs FLOAT,
    has_submeter ENUM('y','n'),
    submeter_id VARCHAR(45),
    unit_charge FLOAT,
    total_charge FLOAT NOT NULL,
    PRIMARY KEY (invoice_id),
    KEY idx_invoice_id(invoice_id),
    KEY idx_fk_tenant_id(tenant_id),
    CONSTRAINT idx_fk_tenant_id
		FOREIGN KEY (tenant_id)
		REFERENCES tenant(tenant_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE submeter (
	submeter_id VARCHAR(45) NOT NULL,
    tenant_id INT NOT NULL,
    meter_id VARCHAR(45) NOT NULL,
    multiplier FLOAT,
    PRIMARY KEY (submeter_id),
    UNIQUE KEY (submeter_id),
    KEY idx_submeter_id (submeter_id),
    KEY idx_fk_2_tenant_id (tenant_id),
    KEY idx_fk_meter_id (meter_id),
    CONSTRAINT idx_fk_2_tenant_id 
		FOREIGN KEY (tenant_id)
        REFERENCES tenant(tenant_id)
        ON DELETE CASCADE,
	CONSTRAINT idx_fk_meter_id
		FOREIGN KEY (meter_id)
        REFERENCES meter(meter_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE meter_tenant (
  meter_id VARCHAR(45) NOT NULL,
  tenant_id INT NOT NULL,
  PRIMARY KEY (meter_id, tenant_id),
  UNIQUE KEY (meter_id, tenant_id),
  KEY idx_fk_2_meter_id(meter_id),
  KEY idx_fk_3_tenant_id(tenant_id),
  CONSTRAINT idx_fk_3_tenant_id
	FOREIGN KEY (tenant_id)
    REFERENCES tenant(tenant_id)
    ON DELETE CASCADE,
  CONSTRAINT idx_fk_2_meter_id
	FOREIGN KEY (meter_id)
    REFERENCES meter(meter_id)
    ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE submeter_bill (
	submeter_bill_id INT NOT NULL AUTO_INCREMENT,
    bill_id INT NOT NULL,
    submeter_id VARCHAR(45) NOT NULL,
    prior_read FLOAT NOT NULL,
    cur_read FLOAT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    cur_amt FLOAT NOT NULL,
    amt_with_multiplier FLOAT NOT NULL,
    amt_due FLOAT NOT NULL,
    PRIMARY KEY (submeter_bill_id),
    UNIQUE KEY (submeter_bill_id),
    KEY idx_submeter_bill_id (submeter_bill_id),
    KEY idx_fk_bill_id (bill_id),
    KEY idx_fk_submeter_id (submeter_id),
    CONSTRAINT idx_fk_bill_id
		FOREIGN KEY (bill_id)
        REFERENCES bill(bill_id)
        ON DELETE CASCADE,
	CONSTRAINT idx_fk_submeter_id
		FOREIGN KEY (submeter_id)
        REFERENCES submeter(submeter_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

