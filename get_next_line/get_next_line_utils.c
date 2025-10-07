/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ljunaid <ljunaid@student.42amman.com>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/18 14:37:40 by ljunaid           #+#    #+#             */
/*   Updated: 2025/10/07 16:27:30 by ljunaid          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"
#include <fcntl.h>

size_t	gnl_strlen(const char *s)
{
	size_t	s_len;

	s_len = 0;
	while (s[s_len] != '\0')
		s_len++;
	return (s_len);
}

char	*gnl_strchr(const char *s, int c)
{
	int		i;
	char	ch;
	if (!s)
		return (NULL);
	i = 0;
	ch = (unsigned char)c;
	while (s[i])
	{
		if (s[i] == ch)
			return ((char *)(s + i));
		i++;
	}
	return (NULL);
}

char	*gnl_strdup(const char *s)
{
	int		i;
	char	*new_string;

	i = 0;
	new_string = malloc(gnl_strlen(s) + 1);
	if (!new_string)
		return (NULL);
	while (s[i])
	{
		new_string[i] = s[i];
		i++;
	}
	new_string[i] = '\0';
	return (new_string);
}

char	*gnl_substr(char const *s, unsigned int start, size_t len)
{
	size_t	i;
	size_t	s_len;
	char	*sub;

	i = 0;
	if (!s)
		return (NULL);
	s_len = gnl_strlen(s);
	if (start >= s_len)
		return (gnl_strdup(""));
	if (len > s_len - start)
		len = s_len - start;
	sub = malloc(len + 1);
	if (!sub)
		return (NULL);
	while (i < len)
	{
		sub[i] = s[start + i];
		i++;
	}
	sub[i] = '\0';
	return (sub);
}

char	*gnl_strjoin(char *s1, char const *s2)
{
	char	*s;
	int		i;
	int		x;

	i = 0;
	x = 0;
	if (!s1 || !s2)
		return (NULL);
	s = malloc(gnl_strlen(s1) + gnl_strlen(s2) + 1);
	if (!s)
	{
		free(s1);
		return (NULL);
	}
	while (s1[i])
	{
		s[i] = s1[i];
		i++;
	}
	while (s2[x])
		s[i++] = s2[x++];
	free(s1);
	s[i] = '\0';
	return (s);
}

// int	main(void)
// {
// 	const char	*text = "hello world what are you doin\n";
// 	char		search;
// 	//char		*result;
// 	search = '\n';
// 	printf ("%s",gnl_strchr(text, search));

//------------------------

// char *s= "HI HI LAYAN";
// char *copy;

// copy = gnl_strdup(s);

// printf("%s\n",copy);
// printf("%s",s);

// free(copy);

//------------------------------

// printf("%s",gnl_substr("HI HOW ARE YOU TODAY", 4 , 6));

// --------------------------------

// printf("%s", gnl_strjoin("HELLO ", "THERE"));

// }

// int main (){
//     int fd;

//     fd = open("file44.txt", O_RDWR | O_CREAT |O_APPEND);

//     printf("fd of the file %d \n", fd);

//     dup2(fd, 1);
//     // write(1, "HI", 5);
//     write(fd, "HI ", 5);

//     return (0);
// }

//  int main(){
//     int fd;
//     char buf[256];
//     int chars_read;

//     fd = open("file.txt", O_RDONLY);

//     while ((chars_read = read(fd, buf,30))){
//         buf[chars_read] = '\0';
//         printf("%s" , buf);
//     }
//  }

//  int main(){
//     int fd;
//     char buf[256];
//     int chars_read;

//     fd = open("file.txt", O_RDONLY);

//     while (read(fd,buf,30)){
//         buf[30] = '\0';
//         printf("%s" , buf);
//     }
//  }