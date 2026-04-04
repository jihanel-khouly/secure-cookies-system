CREATE TABLE `rsa_key_pairs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`private_key` longtext NOT NULL,
	`public_key` longtext NOT NULL,
	`key_size` int NOT NULL,
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rsa_key_pairs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signed_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`key_pair_id` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`file_content` longtext NOT NULL,
	`signature` longtext NOT NULL,
	`file_hash` varchar(64) NOT NULL,
	`signed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signed_files_id` PRIMARY KEY(`id`)
);
