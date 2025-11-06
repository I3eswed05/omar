/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hello.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ialausud <ialausud@student.42amman.com>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 14:43:15 by ialausud          #+#    #+#             */
/*   Updated: 2025/11/06 19:42:40 by ialausud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

int main(int argc, char **argv)
{
    int     i;
    int     value;
    t_list  *stack_a;
    t_list  *new_node;
    int     len;
    
    stack_a = NULL;
    if (argc > 1)
    {
        i = 1;
        while (i < argc)
        {
            len = ft_strlen(argv[i]);
            if (!ft_check(argv[i]))
                return (ft_lstclear(&stack_a), write(1, "Error\n", 6), 0);
            if (len > 11 || !ft_overflowCheck(argv[i]))
                return (write(1, "Error\n", 6), 0);
            value = ft_atoi(argv[i]);
            
            if (stack_a && !ft_check_duplicates(stack_a, value))
                return (ft_lstclear(&stack_a), write(1, "Error\n", 6), 0);

            new_node = ft_lstnew(value);
            if (!new_node)
                return (ft_lstclear(&stack_a), 0);
            ft_lstadd_back(&stack_a, new_node);
            i++;
        }
    }
    
    ft_lstclear(&stack_a); 
    return (0);
}
