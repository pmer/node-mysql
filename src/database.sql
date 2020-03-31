CREATE TABLE IF NOT EXISTS `test` (
    `id` int(11) NOT NULL,
    `name` varchar(50) NOT NULL,
    `address` int(11) NOT NULL,
    `phone` int(11) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `test` (`id`, `name`, `address`, `phone`) VALUES
(1, 'Person 1', 310, 821),
(2, 'Person 2', 311, 852),
(3, 'Person 3', 312, 853),
(4, 'Person 4', 313, 854),
(5, 'Person 5', 314, 855);
