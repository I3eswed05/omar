/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ljunaid <ljunaid@student.42amman.com>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/18 14:37:43 by ljunaid           #+#    #+#             */
/*   Updated: 2025/10/07 16:30:24 by ljunaid          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"

char	*read_and_join(int fd, char *buf, char *s)
{
	int	bytes_to_read;

	bytes_to_read = 1;
	while (!gnl_strchr(s, '\n') && bytes_to_read > 0)
	{
		bytes_to_read = read(fd, buf, BUFFER_SIZE);
		if (bytes_to_read < 0)
		{
			// free(buf);
			return (NULL);
		}
		if (bytes_to_read == 0)
			break ;
		buf[bytes_to_read] = '\0';
		s = gnl_strjoin(s, buf);
		if (!s)
			return (NULL);
	}
	return (s);
}

char	*read_line(int fd, char *s)
{
	char	*buf;

	buf = malloc(BUFFER_SIZE + 1);
	if (!buf)
		return (NULL);
	if (!s)
		return NULL;
	s = read_and_join(fd, buf, s);
	free(buf);
	return (s);
}

char	*extract_line(char *s)
{
	char	*new;
	int		len;

	if (!s)
		gnl_strdup("");
	if (gnl_strchr(s, '\n'))
		len = gnl_strchr(s, '\n') - s + 1;
	else
		len = gnl_strlen(s);
	new = gnl_substr(s, 0, len);
	return (new);
}

char	*get_rest(char *s)
{
	char	*rest_line;
	int		rest_string_len;
	int		start;
	char	*newline_ptr;

	if (!s)
		return (NULL);
	newline_ptr = gnl_strchr(s, '\n');
	if (newline_ptr)
	{
		start = (newline_ptr - s) + 1;
		rest_string_len = gnl_strlen(s) - start;
		rest_line = gnl_substr(s, start, rest_string_len);
	}
	else
	{
		free(s);
		return (NULL);
	}
	free(s);
	return (rest_line);
}

char	*get_next_line(int fd)
{
	char		*line;
	static char	*string;

	if (fd < 0 || BUFFER_SIZE <= 0)
		return (NULL);
	string = read_line(fd, string);
	line = extract_line(string);
	if (line)
		string = get_rest(string);
	if (!line || line[0] == '\0')
	{
		free(line);
		return (NULL);
	}
	return (line);
}

// #include <stdio.h>
// #include <fcntl.h>
// #include "get_next_line.h"

// int main(void)
// {
//     int fd;
//     char *line;

//     fd = open("file.txt", O_RDONLY);
//     if (fd < 0)
//     {
//         perror("Error opening file");
//         return (1);
//     }
//     // fd = 0;
//     while ((line = get_next_line(fd)) != NULL)
//     {
//         printf("%s", line);
//         free(line); // مهم عشان ما يصير memory leak
//     }

//     close(fd);
//     return (0);
// }




// int main()
// {
// 	int fd;
// 	char *line;
	
// 	fd = open ("file.txt",O_RDONLY);
// 	if (fd < 0)
// 		return (0);

// 	while ((line = get_next_line(fd)) != NULL)
// 	{
// 		printf("%s" , line);
// 		free (line);
// 	}
// 	close(fd);
// 	return(0);
// }