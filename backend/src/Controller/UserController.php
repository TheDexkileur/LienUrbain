<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users')]
class UserController extends AbstractController
{
    #[Route('', name: 'api_users_index', methods: ['GET'])]
    public function index(UserRepository $repo): JsonResponse
    {
        $users = $repo->findAll();

        $data = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'roles' => $user->getRoles(),
                'photo' => $user->getPhoto(),
            ];
        }, $users);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_users_show', methods: ['GET'])]
    public function show(UserRepository $repo, int $id): JsonResponse
    {
        $user = $repo->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'roles' => $user->getRoles(),
            'photo' => $user->getPhoto(),
        ]);
    }
}