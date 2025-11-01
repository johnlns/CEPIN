CREATE TABLE `agendamentos_experimentais` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente_nome` text NOT NULL,
	`cliente_email` text NOT NULL,
	`cliente_telefone` text NOT NULL,
	`nome_crianca` text NOT NULL,
	`idade_crianca` text NOT NULL,
	`modalidade_interesse` text NOT NULL,
	`data_preferencia` text NOT NULL,
	`horario_selecionado` text NOT NULL,
	`observacoes` text,
	`status` text DEFAULT 'pendente' NOT NULL,
	`observacoes_admin` text,
	`processado_em` integer,
	`processado_por` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`processado_por`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `matriculas_publicas` (
	`id` text PRIMARY KEY NOT NULL,
	`nome_aluno` text NOT NULL,
	`data_nascimento` text NOT NULL,
	`nome_responsavel` text NOT NULL,
	`telefone_responsavel` text NOT NULL,
	`email_responsavel` text,
	`endereco` text,
	`observacoes` text,
	`modalidade_id` text NOT NULL,
	`modalidade_nome` text NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`observacoes_admin` text,
	`processado_em` integer,
	`processado_por` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`processado_por`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
