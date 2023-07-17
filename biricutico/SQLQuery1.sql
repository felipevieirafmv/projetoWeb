INSERT INTO Salas (Nome, Capacidade, Setor, FotoSala, createdAt, updatedAt) VALUES ('Sala Pequena 02', 10, '401-A', '401A/Ct401A_SalaPequena02-card.png', GETDATE(), GETDATE());
INSERT INTO Pessoas (Usuario, Senha, Nome, createdAt, updatedAt) VALUES ('teste8', 'senha', 'teste', GETDATE(), GETDATE());
INSERT INTO Reuniaos (Assunto, HorarioInicio, HorarioFim, Observacoes, createdAt, updatedAt, IDSala) VALUES ('Reuniao teste2', '2023-07-10 12:00:00', '2023-07-10 13:00:00', 'Reuniao de teste2', GETDATE(), GETDATE(), 6)
INSERT INTO PessoaReuniaos (Responsavel, createdAt, updatedAt, Usuario, IdReuniao) VALUES (1, GETDATE(), GETDATE(), 'VIF1CT', 9)

select * from pessoas

UPDATE Salas
SET Capacidade=2147483646, updatedAt=GETDATE()
WHERE Nome='Via Teams (on-line).'

ALTER TABLE Salas 
ADD FotoSala VARCHAR (255);

select P.Nome, R.Assunto, R.HorarioInicio, R.HorarioFim, R.Observacoes, R.IDSala from Pessoas P
inner join PessoaReuniaos PR
	on P.Usuario = PR.Usuario
inner join Reuniaos R
	on R.IdReuniao = PR.IdReuniao
where p.Usuario = 'vif1ct'

DELETE FROM Pessoas
WHERE Usuario like 'teste%'