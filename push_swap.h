/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ialausud <ialausud@student.42amman.com>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 15:35:26 by ialausud          #+#    #+#             */
/*   Updated: 2025/11/06 22:10:24 by ialausud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PUSH_SWAP_H
# define PUSH_SWAP_H

# include <limits.h>
# include <stdlib.h>
# include <unistd.h>

typedef struct s_node
{
	int				value;
	int				index;
	struct s_node	*next;
}					t_list;

int	ft_atoi(const char *str);
int					ft_check(const char *str);
long long           ft_overflowCheck(const char *str);
void	ft_lstadd_back(t_list **lst, t_list *new);
void	ft_lstclear(t_list **lst);
t_list	*ft_lstnew(int value);
t_list	*ft_lstlast(t_list *lst);
size_t	ft_strlen(const char *str);
int ft_check_duplicates(t_list *stack, int value);


#endif
