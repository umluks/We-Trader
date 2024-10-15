CREATE TABLE stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ativo VARCHAR(10) NOT NULL,
    quantidade INT NOT NULL,
    preco_atual DECIMAL(10, 2) NOT NULL,
    saldo DECIMAL(10, 2) NOT NULL
);
