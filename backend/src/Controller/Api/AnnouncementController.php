<?php

namespace App\Controller\Api;

use App\Entity\Announcement;
use App\Entity\Category;
use App\Repository\AnnouncementRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api/annonces')]
class AnnouncementController extends AbstractController
{
    #[Route('', name: 'api_annonces_index', methods: ['GET'])]
    public function index(AnnouncementRepository $repo): JsonResponse
    {
        $annonces = $repo->findBy([], ['id' => 'DESC']);

        $data = array_map(function (Announcement $annonce) {
            $user = $annonce->getUser();
            $category = $annonce->getCategory();

            return [
                'id' => $annonce->getId(),
                'title' => $annonce->getTitle(),
                'description' => $annonce->getDescription(),
                'status' => $annonce->getStatus(),
                'created_at' => $annonce->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updated_at' => $annonce->getUpdatedAt()?->format('Y-m-d H:i:s'),
                'user' => $user ? [
                    'id' => $user->getId(),
                    'firstname' => $user->getFirstname(),
                    'lastname' => $user->getLastname(),
                    'email' => $user->getEmail(),
                ] : null,
                'category' => $category ? [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                ] : null,
            ];
        }, $annonces);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_annonces_show', methods: ['GET'])]
    public function show(AnnouncementRepository $repo, int $id): JsonResponse
    {
        $annonce = $repo->find($id);

        if (!$annonce) {
            return $this->json(['error' => 'Annonce introuvable'], 404);
        }

        $user = $annonce->getUser();
        $category = $annonce->getCategory();

        return $this->json([
            'id' => $annonce->getId(),
            'title' => $annonce->getTitle(),
            'description' => $annonce->getDescription(),
            'status' => $annonce->getStatus(),
            'created_at' => $annonce->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $annonce->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'user' => $user ? [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
            ] : null,
            'category' => $category ? [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ] : null,
        ]);
    }

    #[Route('', name: 'api_annonces_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        Security $security,
        CategoryRepository $categoryRepository
    ): JsonResponse {
        $user = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || !isset($data['title'], $data['description'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $annonce = new Announcement();
        $annonce->setTitle($data['title']);
        $annonce->setDescription($data['description']);
        $annonce->setStatus($data['status'] ?? 'PENDING');
        $annonce->setUser($user);
        $annonce->setCreatedAt(new \DateTime());
        $annonce->setUpdatedAt(new \DateTime());

        if (!empty($data['category_id'])) {
            $category = $categoryRepository->find($data['category_id']);
            if ($category instanceof Category) {
                $annonce->setCategory($category);
            }
        }

        $em->persist($annonce);
        $em->flush();

        return $this->json([
            'message' => 'Annonce créée',
            'id' => $annonce->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'api_annonces_update', methods: ['PATCH'])]
    public function update(
        int $id,
        Request $request,
        AnnouncementRepository $repo,
        EntityManagerInterface $em,
        Security $security,
        CategoryRepository $categoryRepository
    ): JsonResponse {
        $annonce = $repo->find($id);

        if (!$annonce) {
            return $this->json(['error' => 'Annonce introuvable'], 404);
        }

        $user = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $owner = $annonce->getUser();
        if ($owner && $owner->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        if (isset($data['title'])) {
            $annonce->setTitle($data['title']);
        }

        if (isset($data['description'])) {
            $annonce->setDescription($data['description']);
        }

        if (isset($data['status'])) {
            $annonce->setStatus($data['status']);
        }

        if (array_key_exists('category_id', $data)) {
            if ($data['category_id']) {
                $category = $categoryRepository->find($data['category_id']);
                $annonce->setCategory($category);
            } else {
                $annonce->setCategory(null);
            }
        }

        $annonce->setUpdatedAt(new \DateTime());

        $em->flush();

        return $this->json(['message' => 'Annonce mise à jour']);
    }

    #[Route('/{id}', name: 'api_annonces_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        AnnouncementRepository $repo,
        EntityManagerInterface $em,
        Security $security
    ): JsonResponse {
        $annonce = $repo->find($id);

        if (!$annonce) {
            return $this->json(['error' => 'Annonce introuvable'], 404);
        }

        $user = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $owner = $annonce->getUser();
        if ($owner && $owner->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($annonce);
        $em->flush();

        return $this->json(['message' => 'Annonce supprimée']);
    }
}
