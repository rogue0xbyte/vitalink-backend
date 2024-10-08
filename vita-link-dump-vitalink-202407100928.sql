PGDMP     	        	    
        |            vitalink    15.5 (Debian 15.5-0+deb12u1)    15.3 9    X           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            Z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            [           1262    16388    vitalink    DATABASE     t   CREATE DATABASE vitalink WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE vitalink;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            \           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    16396    doctor    TABLE     �   CREATE TABLE public.doctor (
    category character varying(255),
    id character varying(255) NOT NULL,
    fullname character varying(255),
    passhash character varying(255),
    pfp character varying(255)
);
    DROP TABLE public.doctor;
       public         heap    postgres    false    4            �            1259    16430    dosage    TABLE     *  CREATE TABLE public.dosage (
    id integer NOT NULL,
    drug_name character varying(255),
    datetime character varying(255),
    strength character varying(50),
    remark character varying(255),
    patient_id character varying(255),
    file_id character varying,
    startdate character varying,
    enddate character varying,
    monday character varying,
    tuesday character varying,
    wednesday character varying,
    thursday character varying,
    friday character varying,
    saturday character varying,
    sunday character varying
);
    DROP TABLE public.dosage;
       public         heap    postgres    false    4            �            1259    16429    dosage_id_seq    SEQUENCE     �   CREATE SEQUENCE public.dosage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.dosage_id_seq;
       public          postgres    false    220    4            ]           0    0    dosage_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.dosage_id_seq OWNED BY public.dosage.id;
          public          postgres    false    219            �            1259    25259    files    TABLE     �   CREATE TABLE public.files (
    id integer NOT NULL,
    filename character varying,
    filepath character varying,
    type character varying
);
    DROP TABLE public.files;
       public         heap    postgres    false    4            �            1259    25258    files_id_seq    SEQUENCE     �   CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.files_id_seq;
       public          postgres    false    226    4            ^           0    0    files_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
          public          postgres    false    225            �            1259    16444 
   inr_levels    TABLE     +  CREATE TABLE public.inr_levels (
    id integer NOT NULL,
    level character varying(255),
    location character varying(255),
    labname character varying(255),
    datetime character varying(255),
    myfile character varying(255),
    patient_id character varying(255),
    file_id integer
);
    DROP TABLE public.inr_levels;
       public         heap    postgres    false    4            �            1259    16443    inr_levels_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inr_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.inr_levels_id_seq;
       public          postgres    false    4    222            _           0    0    inr_levels_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.inr_levels_id_seq OWNED BY public.inr_levels.id;
          public          postgres    false    221            �            1259    16389    it    TABLE     �   CREATE TABLE public.it (
    id character varying(255) NOT NULL,
    fullname character varying(255),
    passhash character varying(255),
    pfp character varying(255)
);
    DROP TABLE public.it;
       public         heap    postgres    false    4            �            1259    16416    medicalhistory    TABLE     �   CREATE TABLE public.medicalhistory (
    id integer NOT NULL,
    duration character varying(255),
    condition character varying(255),
    patient_id character varying(255)
);
 "   DROP TABLE public.medicalhistory;
       public         heap    postgres    false    4            �            1259    16415    medicalhistory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.medicalhistory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.medicalhistory_id_seq;
       public          postgres    false    4    218            `           0    0    medicalhistory_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.medicalhistory_id_seq OWNED BY public.medicalhistory.id;
          public          postgres    false    217            �            1259    16403    patients    TABLE     9  CREATE TABLE public.patients (
    id character varying(255) NOT NULL,
    name character varying(255),
    contact character varying(20),
    kinname character varying(255),
    kincontact character varying(20),
    age integer,
    gender character varying(10),
    drugtype character varying(255),
    drugstrength character varying(50),
    beforefood boolean,
    afterfood boolean,
    morning boolean,
    afternoon boolean,
    night boolean,
    monday character varying(255),
    tuesday character varying(255),
    wednesday character varying(255),
    thursday character varying(255),
    friday character varying(255),
    saturday character varying(255),
    sunday character varying(255),
    misdosealert boolean,
    nexttestdate character varying(50),
    startdate character varying(50),
    targetinr character varying(255),
    stoppagereason character varying(255),
    doctor_id character varying(255),
    caretaker_id character varying(255),
    stopped boolean,
    enddate character varying,
    mininr character varying,
    maxinr character varying
);
    DROP TABLE public.patients;
       public         heap    postgres    false    4            �            1259    16458    reports    TABLE     �  CREATE TABLE public.reports (
    report_id integer NOT NULL,
    type character varying(255),
    details character varying(255),
    patient_id character varying(255),
    datetime character varying(255),
    myfile character varying(255),
    startdate character varying,
    enddate character varying,
    location character varying,
    labname character varying,
    file_id integer
);
    DROP TABLE public.reports;
       public         heap    postgres    false    4            �            1259    16457    reports_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.reports_report_id_seq;
       public          postgres    false    224    4            a           0    0    reports_report_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;
          public          postgres    false    223            �           2604    16433 	   dosage id    DEFAULT     f   ALTER TABLE ONLY public.dosage ALTER COLUMN id SET DEFAULT nextval('public.dosage_id_seq'::regclass);
 8   ALTER TABLE public.dosage ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    25262    files id    DEFAULT     d   ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
 7   ALTER TABLE public.files ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    16447    inr_levels id    DEFAULT     n   ALTER TABLE ONLY public.inr_levels ALTER COLUMN id SET DEFAULT nextval('public.inr_levels_id_seq'::regclass);
 <   ALTER TABLE public.inr_levels ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    16419    medicalhistory id    DEFAULT     v   ALTER TABLE ONLY public.medicalhistory ALTER COLUMN id SET DEFAULT nextval('public.medicalhistory_id_seq'::regclass);
 @   ALTER TABLE public.medicalhistory ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    16461    reports report_id    DEFAULT     v   ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);
 @   ALTER TABLE public.reports ALTER COLUMN report_id DROP DEFAULT;
       public          postgres    false    224    223    224            J          0    16396    doctor 
   TABLE DATA                 public          postgres    false    215   �C       O          0    16430    dosage 
   TABLE DATA                 public          postgres    false    220   �D       U          0    25259    files 
   TABLE DATA                 public          postgres    false    226   �E       Q          0    16444 
   inr_levels 
   TABLE DATA                 public          postgres    false    222   QF       I          0    16389    it 
   TABLE DATA                 public          postgres    false    214   H       M          0    16416    medicalhistory 
   TABLE DATA                 public          postgres    false    218   	I       K          0    16403    patients 
   TABLE DATA                 public          postgres    false    216   �I       S          0    16458    reports 
   TABLE DATA                 public          postgres    false    224   L       b           0    0    dosage_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.dosage_id_seq', 192, true);
          public          postgres    false    219            c           0    0    files_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.files_id_seq', 9, true);
          public          postgres    false    225            d           0    0    inr_levels_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.inr_levels_id_seq', 19, true);
          public          postgres    false    221            e           0    0    medicalhistory_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.medicalhistory_id_seq', 15, true);
          public          postgres    false    217            f           0    0    reports_report_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.reports_report_id_seq', 402, true);
          public          postgres    false    223            �           2606    16402    doctor doctor_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.doctor DROP CONSTRAINT doctor_pkey;
       public            postgres    false    215            �           2606    16437    dosage dosage_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.dosage
    ADD CONSTRAINT dosage_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.dosage DROP CONSTRAINT dosage_pkey;
       public            postgres    false    220            �           2606    25272    files files_pk 
   CONSTRAINT     L   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pk PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.files DROP CONSTRAINT files_pk;
       public            postgres    false    226            �           2606    16451    inr_levels inr_levels_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.inr_levels
    ADD CONSTRAINT inr_levels_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.inr_levels DROP CONSTRAINT inr_levels_pkey;
       public            postgres    false    222            �           2606    16395 
   it it_pkey 
   CONSTRAINT     H   ALTER TABLE ONLY public.it
    ADD CONSTRAINT it_pkey PRIMARY KEY (id);
 4   ALTER TABLE ONLY public.it DROP CONSTRAINT it_pkey;
       public            postgres    false    214            �           2606    16423 "   medicalhistory medicalhistory_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.medicalhistory
    ADD CONSTRAINT medicalhistory_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.medicalhistory DROP CONSTRAINT medicalhistory_pkey;
       public            postgres    false    218            �           2606    16409    patients patients_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.patients DROP CONSTRAINT patients_pkey;
       public            postgres    false    216            �           2606    16465    reports reports_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);
 >   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_pkey;
       public            postgres    false    224            �           2606    16438    dosage dosage_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.dosage
    ADD CONSTRAINT dosage_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);
 G   ALTER TABLE ONLY public.dosage DROP CONSTRAINT dosage_patient_id_fkey;
       public          postgres    false    220    3241    216            �           2606    25273    inr_levels fk_inr_levels_files    FK CONSTRAINT     }   ALTER TABLE ONLY public.inr_levels
    ADD CONSTRAINT fk_inr_levels_files FOREIGN KEY (file_id) REFERENCES public.files(id);
 H   ALTER TABLE ONLY public.inr_levels DROP CONSTRAINT fk_inr_levels_files;
       public          postgres    false    3251    222    226            �           2606    25284    reports fk_reports_files    FK CONSTRAINT     w   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_reports_files FOREIGN KEY (file_id) REFERENCES public.files(id);
 B   ALTER TABLE ONLY public.reports DROP CONSTRAINT fk_reports_files;
       public          postgres    false    224    3251    226            �           2606    16452 %   inr_levels inr_levels_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.inr_levels
    ADD CONSTRAINT inr_levels_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);
 O   ALTER TABLE ONLY public.inr_levels DROP CONSTRAINT inr_levels_patient_id_fkey;
       public          postgres    false    216    3241    222            �           2606    16424 -   medicalhistory medicalhistory_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.medicalhistory
    ADD CONSTRAINT medicalhistory_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);
 W   ALTER TABLE ONLY public.medicalhistory DROP CONSTRAINT medicalhistory_patient_id_fkey;
       public          postgres    false    218    3241    216            �           2606    16410     patients patients_doctor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id);
 J   ALTER TABLE ONLY public.patients DROP CONSTRAINT patients_doctor_id_fkey;
       public          postgres    false    216    3239    215            �           2606    16466    reports reports_patient_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);
 I   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_patient_id_fkey;
       public          postgres    false    3241    224    216            J     x�ݑ=o�@�w~�mi���%�/uB�QAE(ke�G8�tI�}I�JU�<X��؏��\lwd��m�y�:��mM�F����/J��!���m�>y"��fN��F����֝*�p��8EF���dE�P];�L:K�L��TYK5��e���.���V��Rqǵ��Bc!��� �!s ,���T�sŽ�%�Ү�>�44P�.u͹�|����J�'������� ����ȫ����+���#����Yݕ�9�)�z�pCIO&_9�#�      O   �   x���v
Q���W((M��L�K�/NLOUs�	uV�05�QPwL�,)��U2��Ltu��B���""�,� �Cc �/�Ǉ<RӚ˓�댱���B���-�L�!�3יXbӮ����	v�1�I�F�hN�z�L��8�A�4Cs�r N^��      U   �   x���v
Q���W((M��L�K��I-Vs�	uV�0�QPH,����O���IL����J-�/*�+OM*P*���"�F}��B��\��`6�0j)(J-N.�,�+�KG�].�$#���,����������T�}�U�n�%�햖&DٍM��\\ (�O      Q   �  x���]o�0���+|�Uj-ABv������X|��+!���Q�Mb�*Y6G>�y0~{Q�0Y��!+UUՈR>�rny��b��9C:�n�9<���O�F�j�Y�<-�+���z� �.��HG��f"�#w.�0����$�O�CF���u�}��h0�rH,]f%e�neq8n��Y��?!��T�[ʰp���?��^8=�u"���J�zk�/�A�+Y�ivt$��Q�e�3DŇƬf�&�iL�k�a��;����}{Ч6�)eU�P�@���6?�{��!y{9����1�tL
'��4��F��e���$���X�`�e��c���c�0#s��n8��F�����W���|�'߹����G�����]|�ݟ36wZ�����	��L,���Ɛ �uV7����&�������=���      I   �   x�ݏ�N�@E�|�v	ų޷�R����Z4�;k9�G��'�Z��-nqtO}n��V���]�+}�q�/����ql�SQ���,^Dq��/w�u8�u�HBȊ�b�5���q��� |JH�$�08tt`�$�sް	�rH۔M����V�6IP9���(orF�����ۇr^p�c���\�0.��u�i���uW�FQo��: N�K��P�8�����n�����      M   |   x���v
Q���W((M��L��MM�LN���,.�/�Ts�	uV�04�QP7V���+�(V�A��$�1�����T]Ӛ˓x�qfb`hF�aF�3'�0c|�Y�h�	>�,I4��a� Ӹ� ���      K   j  x���o�0���+�-�V"�	�lOP��_�C�=Mu�I���g;M�����.R���c�}�Y�:��0�:�.��^c&x��p�']�,�È8.�3�X,��������^�-? ��M�Ĥ��X�Dyε;��L���J�f2�gp������Y�׃�M��Y���d���Τ����p�I�r�Z���v����U��)�1M�-�"�q�b.q����������z��:}�v8��w��O����z�i�q�S�e��Plp^�F�cLc`�0���sց����;�"9�^�U�VAv \K�xB� ��w����a/Wq�F�R���	�V��T����8�������)V�C��Q�аt���u��a J�W'^�1��VA��\��#��C~Ů��Ѻ3��
7B��
�]��x��?��?�2J�v�;�LL���"$�s!R�H�I��yF����FuΧr/�[�"��E���{���+`?���\�/�-�,�J\b"*��Bh��A܀z�VuN�g�_�A5?Ҭw�����$�HHhf�-`|���KҨ͵}R�&� Y֛��8�Sk�c�]܋
�c�\�<��T��+I9����~#ʆ      S   K  x��]]oW}�W���$��ܯM���6U�Dء��b��+��6��׳N��Ơ�=GdK�ϰ3993�������ͨ��]��f���͋�]-��/.oχ�O!�狶�5��<y޽y�s�~!z�bdJ��{wu{y�Ͽ?���b�DA-��_֓��y9���O^Κf���f�3z4��7�in�k���?_o�F��'e�I�՟>��\�m�g�ޯ_����Շ=(n���U����Y]����U1����梨�A}�>(�6�j3��Ūq���}Y�.�z~��������U1\�a^�=T�i��z�'t�z����� �l���e~lfu��|��f���wd���w�f�<Y�y9n�Ūn�˓��)M���ys>|��������_{���C���o��r���zl�ᴃ�P��/&w	՚���r�J���+����[�6�_5���\�. �[?V.����D���o�U^��!�����ZX�d�UN�A����)�ʉ�N��N�Ng'���#
Q�;�wD8	���FDB#"��Zrղ���J�*4���\OKn�%7B��x��c@��3��r4�r4�r���A�;�h<A�h�����
*��<���B+`����U��N��N��N��N�N�N�N>w
�S�uv���Zg��]�uv�X?z����.�:�H��"�����.B�S�i�H�N���"T;%�vJp�x�]�uv���%(;%;%;%;%(;�pv*��T�;��ٕpGA	w�����A���$ (�����>1[����O�x)�e��j�� 81���@Kn�%7A�K7�e��d�'M�M���nY���u��zZr4�;�!{�pbiSq��C�I���"�	�᱓��Ih�$Pv8;��M��K4��GL���(��=bE��D�#&Q�I�9
��s��s��M�m�D3z��-�7Mr�i��M�t����7{�籓���������籓����������ͺm�h�� �u�4)ЦI�6M
�iR��$��h�H[I :�4AEs��-�'�"MP���yD	��K�	�DT	*�OP%��J4A���*�x"�U�	��'�J��*i���	�*�J��*i�W�d�^�y\h�q5,ϓ$[�A
*5h����@�f�m3P����/հ��ji$d�$di~ղ.��e]�U����J[!���
]!���
_!��c'�����I����+����J�+�н���+����J�+�н�
7����N���<U�3J�R�:q��W�:�S�;9�A�:�A�:�A�:�A�:�A�:�d\m2�kU�W\=��z;y;y;y(;y;y;y;(;�E,����@�f�~��y��Q�wD�}a�W�:q���.B;���N���"M;E�v�Y�5ҴS�i��N���M;%�vJP��ډ�W\i{ŕ�W\�{��W\�{��W\�{��W\�����h��H����\���I5��^q#	7��v���-n�z�+��֕�� �m[ϫ�c1j���<^�����c�AcqO��f5��r��/��>�v!ň;2�Ⱥ�1�FO�^|5����wժi�]��5q߈�E�O�;#J�F$?Q8���"*���=�7n�d     